import { getProjects } from "@/lib/queries";
import {
  getPublicRepos,
  getRepoSummary,
  getUnimportedRepos,
  humanizeRepoName,
} from "@/lib/github";
import type { ProjectWithTech } from "@/types/database";

export interface ProjectCardData {
  key: string;
  title: string;
  summary: string;
  tags: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
}

function fromProject(project: ProjectWithTech): ProjectCardData {
  return {
    key: project.id,
    title: project.title,
    summary: project.summary,
    tags: project.tech_stack.map((tech) => tech.name),
    githubUrl: project.github_url,
    liveUrl: project.live_url,
    featured: project.featured,
  };
}

/**
 * Curated projects from the CMS first (in their display order), then every
 * other public GitHub repo, most recently pushed first. A repo that has a
 * CMS entry with the same GitHub URL only appears once, as the CMS entry.
 */
export async function getAllProjectCards(): Promise<ProjectCardData[]> {
  const [projects, repos] = await Promise.all([getProjects(), getPublicRepos()]);

  const githubOnly = getUnimportedRepos(
    repos,
    projects.map((project) => project.github_url)
  );
  const repoCards = await Promise.all(
    githubOnly.map(async (repo) => ({
      key: `github-${repo.id}`,
      title: humanizeRepoName(repo.name),
      summary: await getRepoSummary(repo),
      tags: [...new Set([repo.language, ...repo.topics].filter((tag): tag is string => Boolean(tag)))],
      githubUrl: repo.html_url,
      liveUrl: repo.homepage || null,
      featured: false,
    }))
  );

  return [...projects.map(fromProject), ...repoCards];
}
