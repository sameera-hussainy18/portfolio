import { unstable_cache } from "next/cache";
import { siteConfig } from "@/lib/site-config";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  archived: boolean;
  language: string | null;
  topics: string[];
  updated_at: string;
  pushed_at: string;
}

/** Add this topic to a repo on GitHub to keep it off the portfolio. */
export const HIDE_TOPIC = "no-portfolio";

// Pages using these are force-dynamic, which disables fetch caching, so the
// results are cached with unstable_cache instead. Unauthenticated GitHub API
// calls are limited to 60/hour; a GITHUB_TOKEN env var raises that if needed.
const REPOS_REVALIDATE_SECONDS = 1800;
const README_REVALIDATE_SECONDS = 3600;

function githubHeaders(accept = "application/vnd.github+json"): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return token
    ? { Accept: accept, Authorization: `Bearer ${token}` }
    : { Accept: accept };
}

function getGitHubUsername(): string {
  const match = siteConfig.links.github.match(/github\.com\/([^/]+)/);
  return match?.[1] ?? "";
}

// Throws on failure so a failed request is never cached.
const getCachedRepos = unstable_cache(
  async (username: string): Promise<GitHubRepo[]> => {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`,
      { headers: githubHeaders() }
    );
    if (!res.ok) throw new Error(`GitHub repos request failed: ${res.status}`);

    const repos = (await res.json()) as GitHubRepo[];
    return repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      homepage: repo.homepage,
      fork: repo.fork,
      archived: repo.archived,
      language: repo.language,
      topics: repo.topics ?? [],
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at,
    }));
  },
  ["github-repos"],
  { revalidate: REPOS_REVALIDATE_SECONDS, tags: ["github"] }
);

const getCachedReadmeSummary = unstable_cache(
  async (fullName: string): Promise<string | null> => {
    const res = await fetch(`https://api.github.com/repos/${fullName}/readme`, {
      headers: githubHeaders("application/vnd.github.raw"),
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub README request failed: ${res.status}`);
    return readmeSummary(await res.text());
  },
  ["github-readme-summary"],
  { revalidate: README_REVALIDATE_SECONDS, tags: ["github"] }
);

/** Public, non-fork, non-archived repos that should appear on the portfolio. */
export async function getPublicRepos(): Promise<GitHubRepo[]> {
  const username = getGitHubUsername();
  if (!username) return [];

  try {
    const repos = await getCachedRepos(username);
    return repos.filter(
      (repo) =>
        !repo.fork &&
        !repo.archived &&
        repo.name.toLowerCase() !== username.toLowerCase() &&
        !repo.topics.includes(HIDE_TOPIC)
    );
  } catch (error) {
    console.error("[github] could not load repos:", error);
    return [];
  }
}

/** The repo's GitHub description, or the first paragraph of its README. */
export async function getRepoSummary(repo: GitHubRepo): Promise<string> {
  if (repo.description) return repo.description;
  try {
    return (await getCachedReadmeSummary(repo.full_name)) ?? "";
  } catch (error) {
    console.error(`[github] could not load README for ${repo.full_name}:`, error);
    return "";
  }
}

export async function getRepoByFullName(
  fullName: string
): Promise<GitHubRepo | null> {
  const res = await fetch(`https://api.github.com/repos/${fullName}`, {
    headers: githubHeaders(),
  });

  if (!res.ok) return null;
  return res.json();
}

export function normalizeGitHubUrl(url: string): string {
  return url.replace(/\/$/, "").toLowerCase();
}

export function getUnimportedRepos(
  repos: GitHubRepo[],
  existingGithubUrls: (string | null)[]
): GitHubRepo[] {
  const existing = new Set(
    existingGithubUrls
      .filter((url): url is string => Boolean(url))
      .map(normalizeGitHubUrl)
  );

  return repos.filter((repo) => !existing.has(normalizeGitHubUrl(repo.html_url)));
}

const ACRONYMS = new Set(["ai", "ml", "cnn", "clv", "llm", "nlp", "api", "ui", "ux", "sql", "iot", "os"]);
const MINOR_WORDS = new Set(["a", "an", "and", "at", "by", "for", "in", "of", "on", "or", "the", "to", "with"]);

/** "brain-tumor-cnn-classification" -> "Brain Tumor CNN Classification". */
export function humanizeRepoName(name: string): string {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word, i) => {
      const lower = word.toLowerCase();
      if (ACRONYMS.has(lower)) return lower.toUpperCase();
      if (i > 0 && MINOR_WORDS.has(lower)) return lower;
      if (/[A-Z]/.test(word.slice(1))) return word; // already styled, e.g. RenewalRadar
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

const SUMMARY_MAX_LENGTH = 220;

/** First prose paragraph of a README, stripped of markdown, for use as a summary. */
export function readmeSummary(markdown: string): string | null {
  const paragraph: string[] = [];
  let inCodeBlock = false;

  for (const rawLine of markdown.replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      if (paragraph.length > 0) break;
      continue;
    }
    if (inCodeBlock) continue;

    const isProse =
      line !== "" &&
      !/^(#|<|!\[|\[!\[|\||>|[-*+] |\d+\. )/.test(line) &&
      !/^[-*_]{3,}$/.test(line);
    if (!isProse) {
      if (paragraph.length > 0) break;
      continue;
    }
    paragraph.push(line);
  }

  const text = paragraph
    .join(" ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<(https?:[^>]+)>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/(\*\*|__)(.+?)\1/g, "$2")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return null;
  if (text.length <= SUMMARY_MAX_LENGTH) return text;
  return text.slice(0, text.lastIndexOf(" ", SUMMARY_MAX_LENGTH)) + "…";
}
