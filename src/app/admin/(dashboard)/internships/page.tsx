import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { getInternships } from "@/lib/queries";
import { deleteInternship } from "@/lib/actions/internships";

export const dynamic = "force-dynamic";

export default async function AdminInternshipsPage() {
  const internships = await getInternships();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading eyebrow="content" title="Internships" />
        <Button render={<Link href="/admin/internships/new" />}>
          <Plus className="size-4" />
          New Internship
        </Button>
      </div>

      {internships.length === 0 ? (
        <EmptyState message="No internships yet. Add your first one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {internships.map((internship) => (
              <TableRow key={internship.id}>
                <TableCell className="font-medium">{internship.company}</TableCell>
                <TableCell>{internship.role}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {internship.start_date} — {internship.end_date ?? "Present"}
                </TableCell>
                <TableCell>{internship.display_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={<Link href={`/admin/internships/${internship.id}/edit`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      itemLabel="Internship"
                      action={deleteInternship}
                      id={internship.id}
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
