import { MessageRow } from "@/components/admin/message-row";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { getContactMessages } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="inbox"
        title="Messages"
        description="Submissions from the public Get in Touch form."
      />

      {messages.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <MessageRow key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}
