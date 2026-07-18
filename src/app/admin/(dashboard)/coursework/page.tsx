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
import { getCourseWork } from "@/lib/queries";
import { deleteCourseWork } from "@/lib/actions/coursework";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS = { cs: "Computer Science", business: "Business" };

export default async function AdminCourseWorkPage() {
  const coursework = await getCourseWork();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading eyebrow="content" title="Coursework" />
        <Button render={<Link href="/admin/coursework/new" />}>
          <Plus className="size-4" />
          Add Course
        </Button>
      </div>

      {coursework.length === 0 ? (
        <EmptyState message="No coursework entries yet. Add your first one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sem</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coursework.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.semester}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[10px]">
                    {CATEGORY_LABELS[item.category]}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {item.course_code}
                </TableCell>
                <TableCell className="font-medium">
                  {item.course_title}
                </TableCell>
                <TableCell>{item.display_order}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={
                        <Link href={`/admin/coursework/${item.id}/edit`} />
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      itemLabel="Course"
                      action={deleteCourseWork}
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
