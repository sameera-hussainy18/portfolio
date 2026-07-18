import {
  FolderGit2,
  Briefcase,
  ShieldCheck,
  Code2,
  GraduationCap,
  Mail,
  Lock,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { getContentCounts, getUnreadInboxCounts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [counts, inbox] = await Promise.all([
    getContentCounts(),
    getUnreadInboxCounts(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeading eyebrow="admin" title="Overview" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Projects"
          value={counts.projects}
          href="/admin/projects"
          icon={FolderGit2}
        />
        <StatCard
          label="Internships"
          value={counts.internships}
          href="/admin/internships"
          icon={Briefcase}
        />
        <StatCard
          label="Certificates"
          value={counts.certificates}
          href="/admin/certificates"
          icon={ShieldCheck}
        />
        <StatCard
          label="Tech Stack"
          value={counts.techStack}
          href="/admin/tech-stack"
          icon={Code2}
        />
        <StatCard
          label="Coursework"
          value={counts.coursework}
          href="/admin/coursework"
          icon={GraduationCap}
        />
        <StatCard
          label="Unread Messages"
          value={inbox.unreadMessages}
          href="/admin/messages"
          icon={Mail}
          highlight={inbox.unreadMessages > 0}
        />
        <StatCard
          label="Unread Notes"
          value={inbox.unreadNotes}
          href="/admin/notes"
          icon={Lock}
          highlight={inbox.unreadNotes > 0}
        />
      </div>
    </div>
  );
}
