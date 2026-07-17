import { siteConfig } from "@/lib/site-config";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  fork: boolean;
  language: string | null;
  updated_at: string;
}

function getGitHubUsername(): string {
  const match = siteConfig.links.github.match(/github\.com\/([^/]+)/);
  return match?.[1] ?? "";
}

export async function getPublicRepos(): Promise<GitHubRepo[]> {
  const username = getGitHubUsername();
  if (!username) return [];

  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) return [];

  const repos = (await res.json()) as GitHubRepo[];
  return repos.filter((repo) => !repo.fork);
}

export async function getRepoByFullName(
  fullName: string
): Promise<GitHubRepo | null> {
  const res = await fetch(`https://api.github.com/repos/${fullName}`, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  return res.json();
}

export function getUnimportedRepos(
  repos: GitHubRepo[],
  existingGithubUrls: (string | null)[]
): GitHubRepo[] {
  const existing = new Set(
    existingGithubUrls
      .filter((url): url is string => Boolean(url))
      .map((url) => url.replace(/\/$/, "").toLowerCase())
  );

  return repos.filter(
    (repo) => !existing.has(repo.html_url.replace(/\/$/, "").toLowerCase())
  );
}

export function humanizeRepoName(name: string): string {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
