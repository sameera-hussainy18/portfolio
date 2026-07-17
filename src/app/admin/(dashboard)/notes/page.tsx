import { NoteRow } from "@/components/admin/note-row";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { getPrivateNotes } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminNotesPage() {
  const notes = await getPrivateNotes();

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="inbox"
        title="Notes"
        description="Private notes — never shown anywhere on the public site."
      />

      {notes.length === 0 ? (
        <EmptyState message="No notes yet." />
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
