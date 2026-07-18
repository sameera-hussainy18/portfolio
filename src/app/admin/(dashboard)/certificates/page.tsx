import Image from "next/image";
import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
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
import { getCertificates } from "@/lib/queries";
import { deleteCertificate } from "@/lib/actions/certificates";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await getCertificates();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <SectionHeading eyebrow="content" title="Certificates" />
        <Button render={<Link href="/admin/certificates/new" />}>
          <Plus className="size-4" />
          New Certificate
        </Button>
      </div>

      {certificates.length === 0 ? (
        <EmptyState message="No certificates yet. Add your first one." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Issuer</TableHead>
              <TableHead>Issued</TableHead>
              <TableHead>Credential</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell>
                  {certificate.image_url ? (
                    <Image
                      src={certificate.image_url}
                      alt=""
                      width={48}
                      height={30}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="h-[30px] w-12 rounded bg-muted" />
                  )}
                </TableCell>
                <TableCell className="font-medium">{certificate.title}</TableCell>
                <TableCell>{certificate.issuer}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {certificate.issue_date}
                </TableCell>
                <TableCell>
                  {certificate.credential_url ? (
                    <Link
                      href={certificate.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Verify
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={<Link href={`/admin/certificates/${certificate.id}/edit`} />}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <DeleteButton
                      itemLabel="Certificate"
                      action={deleteCertificate}
                      id={certificate.id}
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
