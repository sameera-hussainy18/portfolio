import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicRepos, getUnimportedRepos } from "@/lib/github";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function GitHubImportPanel({
  existingGithubUrls,
}: {
  existingGithubUrls: (string | null)[];
}) {
  const repos = await getPublicRepos();
  const unimported = getUnimportedRepos(repos, existingGithubUrls);

  if (unimported.length === 0) return null;

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <GitHubIcon className="size-4 text-muted-foreground" />
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Import from GitHub — {unimported.length} repo
            {unimported.length === 1 ? "" : "s"} not on the site yet
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-border/60">
          {unimported.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {repo.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {repo.description || "No description on GitHub"} · Updated{" "}
                  {formatDate(repo.updated_at)}
                </p>
              </div>
              <Link
                href={`/admin/projects/new?repo=${encodeURIComponent(repo.full_name)}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/60 px-3 py-1.5 font-mono text-xs text-foreground transition-colors hover:bg-accent"
              >
                Import
                <ArrowRight className="size-3" />
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
