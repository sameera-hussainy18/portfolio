import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Certificate } from "@/types/database";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export function CertificateCard({
  certificate,
}: {
  certificate: Certificate;
}) {
  return (
    <Card className="glow-border h-full overflow-hidden py-0">
      {certificate.image_url && (
        <div className="relative aspect-[16/10] w-full bg-muted">
          <Image
            src={certificate.image_url}
            alt={certificate.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <CardHeader className="pt-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <CardTitle className="text-base">{certificate.title}</CardTitle>
            <CardDescription>{certificate.issuer}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 pb-4">
        <span className="font-mono text-xs text-muted-foreground">
          {formatDate(certificate.issue_date)}
        </span>
        {certificate.credential_url && (
          <Link
            href={certificate.credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
          >
            Verify
            <ExternalLink className="size-3" />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
