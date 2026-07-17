import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-mono text-xs text-muted-foreground">
          &copy; {year} {siteConfig.name}
        </p>

        <div className="flex items-center gap-4">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <GitHubIcon className="size-5" />
          </Link>
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-colors hover:text-primary"
          >
            <LinkedInIcon className="size-5" />
          </Link>
          <Link
            href="/admin/login"
            className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
