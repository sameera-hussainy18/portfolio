import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { ProfilePhoto } from "@/components/home/profile-photo";
import { CGPARing } from "@/components/home/cgpa-ring";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <div className="flex flex-col-reverse items-start gap-10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
          {"// whoami"}
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground text-glow sm:text-5xl">
          {siteConfig.name}
        </h1>
        <p className="max-w-xl font-mono text-sm text-muted-foreground">
          {siteConfig.tagline}
        </p>
        <p className="max-w-xl text-muted-foreground">{siteConfig.bio}</p>

        <div className="glow-border inline-flex w-fit items-center gap-2 rounded-full bg-primary/5 px-3.5 py-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full motion-safe:animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-foreground">
            Open to Hackathons · Internships · Jobs
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button render={<Link href="/projects" />}>View Projects</Button>
          <Button variant="outline" render={<Link href="/contact" />}>
            Get in Touch
          </Button>
          <Button
            variant="ghost"
            render={<a href="/resume.pdf" download />}
          >
            <Download className="size-4" />
            Download CV
          </Button>
          <div className="ml-1 flex items-center gap-3">
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
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <ProfilePhoto />
        <CGPARing
          cgpa={siteConfig.academics.cgpa}
          percent={siteConfig.academics.progressPercent}
          caption={`${siteConfig.academics.semestersCompleted} of ${siteConfig.academics.totalSemesters} Semesters`}
        />
      </div>
    </div>
  );
}
