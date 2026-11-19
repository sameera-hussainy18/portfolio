import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitHubIcon } from "@/components/icons";
import { TiltCard } from "@/components/shared/tilt-card";
import type { ProjectCardData } from "@/lib/project-cards";

export function ProjectCard({ project }: { project: ProjectCardData }) {
  return (
    <TiltCard className="h-full">
      <Card className="glow-border h-full transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg">{project.title}</CardTitle>
            {project.featured && (
              <Star className="size-4 shrink-0 fill-primary text-primary" />
            )}
          </div>
          <CardDescription>{project.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-4">
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="font-mono text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center gap-4 bg-transparent">
          {project.githubUrl && (
            <Link
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              <GitHubIcon className="size-3.5" />
              Code
            </Link>
          )}
          {project.liveUrl && (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowUpRight className="size-3.5" />
              Live
            </Link>
          )}
        </CardFooter>
      </Card>
    </TiltCard>
  );
}
