"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { setMessageRead, deleteMessage } from "@/lib/actions/inbox";
import type { ContactMessage } from "@/types/database";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function MessageRow({ message }: { message: ContactMessage }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await setMessageRead(message.id, checked);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.error ?? "Could not update.");
      }
    });
  };

  return (
    <Card className={message.is_read ? "opacity-70" : "glow-border"}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{message.name}</p>
              {!message.is_read && (
                <Badge className="text-[10px]">New</Badge>
              )}
            </div>
            <a
              href={`mailto:${message.email}`}
              className="font-mono text-xs text-primary hover:underline"
            >
              {message.email}
            </a>
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {formatDate(message.created_at)}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm text-muted-foreground">
          {message.message}
        </p>

        <div className="flex items-center justify-between border-t border-border/60 pt-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={message.is_read}
              onCheckedChange={handleToggle}
              disabled={isPending}
            />
            <span className="text-xs text-muted-foreground">
              {message.is_read ? "Read" : "Mark as read"}
            </span>
          </div>
          <DeleteButton itemLabel="Message" action={deleteMessage} id={message.id} />
        </div>
      </CardContent>
    </Card>
  );
}
