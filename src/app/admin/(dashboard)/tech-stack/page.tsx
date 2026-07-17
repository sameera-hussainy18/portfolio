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
import { getTechStack } from "@/lib/queries";
import { deleteTechStack } from "@/lib/actions/tech-stack";

export const dynamic = "force-dynamic";

export default async function AdminTechStackPage() {
  const techStack = await getTechStack();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading eyebrow="content" title="Tech Stack" />
        <Button render={<Link href="/admin/tech-stack/new" />}>
          <Plus className="size-4" />
          New Entry
        </Button>
      </div>

      {techStack.length === 0 ? (
        <EmptyState message="No tech stack entries yet. Add your first one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {techStack.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px] capitalize">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell>{item.display_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={<Link href={`/admin/tech-stack/${item.id}/edit`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      itemLabel="Tech stack entry"
                      action={deleteTechStack}
                      id={item.id}
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
