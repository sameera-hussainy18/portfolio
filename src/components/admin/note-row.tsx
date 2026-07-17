"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { setNoteRead, deleteNote } from "@/lib/actions/inbox";
import type { PrivateNoteWithUrl } from "@/lib/queries";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function NoteRow({ note }: { note: PrivateNoteWithUrl }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await setNoteRead(note.id, checked);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error ?? "Could not update.");
      }
    });
  };

  return (
    <Card className={note.is_read ? "opacity-70" : "glow-border"}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">
              {note.name || "Anonymous"}
            </p>
            {!note.is_read && <Badge className="text-[10px]">New</Badge>}
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(note.created_at)}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {note.message}
        </p>

        {note.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={note.imageUrl}
            alt="Attachment"
            className="max-h-64 w-fit rounded-lg border border-border/60 object-contain"
          />
        )}

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={note.is_read}
              onCheckedChange={handleToggle}
              disabled={isPending}
            />
            <span className="text-xs text-muted-foreground">
              {note.is_read ? "Read" : "Mark as read"}
            </span>
          </div>
          <DeleteButton itemLabel="Note" action={deleteNote} id={note.id} />
        </div>
      </CardContent>
    </Card>
  );
}
