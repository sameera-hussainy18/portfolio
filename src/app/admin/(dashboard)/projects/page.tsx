import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { getProjects } from "@/lib/queries";
import { deleteProject } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading eyebrow="content" title="Projects" />
        <Button render={<Link href="/admin/projects/new" />}>
          <Plus className="size-4" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Create your first one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Tech</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.slice(0, 3).map((t) => (
                      <Badge key={t.id} variant="secondary" className="text-[10px]">
                        {t.name}
                      </Badge>
                    ))}
                    {project.tech_stack.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{project.featured ? "Yes" : "—"}</TableCell>
                <TableCell>{project.display_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={<Link href={`/admin/projects/${project.id}/edit`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      itemLabel="Project"
                      action={deleteProject}
                      id={project.id}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
