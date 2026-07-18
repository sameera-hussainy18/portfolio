import { createClient } from "@/lib/supabase/server";
import type {
  Certificate,
  ContactMessage,
  CourseWork,
  Internship,
  InternshipWithTech,
  PrivateNote,
  Project,
  ProjectWithTech,
  TechStack,
} from "@/types/database";

export async function getProjects(): Promise<ProjectWithTech[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_tech_stack(tech_stack(*))")
    .order("display_order", { ascending: true });

  return mapTechJoin<Project>(data, "project_tech_stack");
}

export async function getFeaturedProjects(
  limit = 3
): Promise<ProjectWithTech[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_tech_stack(tech_stack(*))")
    .eq("featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);

  return mapTechJoin<Project>(data, "project_tech_stack");
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectWithTech | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_tech_stack(tech_stack(*))")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;
  return mapTechJoin<Project>([data], "project_tech_stack")[0] ?? null;
}

export async function getProjectById(
  id: string
): Promise<ProjectWithTech | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, project_tech_stack(tech_stack(*))")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;
  return mapTechJoin<Project>([data], "project_tech_stack")[0] ?? null;
}

export async function getInternshipById(
  id: string
): Promise<InternshipWithTech | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("internships")
    .select("*, internship_tech_stack(tech_stack(*))")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;
  return mapTechJoin<Internship>([data], "internship_tech_stack")[0] ?? null;
}

export async function getCertificateById(
  id: string
): Promise<Certificate | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ?? null;
}

export async function getTechStackById(id: string): Promise<TechStack | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tech_stack")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ?? null;
}

export async function getInternships(): Promise<InternshipWithTech[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("internships")
    .select("*, internship_tech_stack(tech_stack(*))")
    .order("display_order", { ascending: true });

  return mapTechJoin<Internship>(data, "internship_tech_stack");
}

export async function getCertificates(): Promise<Certificate[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("display_order", { ascending: true });

  return data ?? [];
}

export async function getTechStack(): Promise<TechStack[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tech_stack")
    .select("*")
    .order("display_order", { ascending: true });

  return data ?? [];
}

export async function getCourseWork(): Promise<CourseWork[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coursework")
    .select("*")
    .order("semester", { ascending: true })
    .order("display_order", { ascending: true });

  return data ?? [];
}

export async function getCourseWorkById(id: string): Promise<CourseWork | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coursework")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data ?? null;
}

export interface ContentCounts {
  projects: number;
  internships: number;
  certificates: number;
  techStack: number;
  coursework: number;
}

export async function getContentCounts(): Promise<ContentCounts> {
  const supabase = await createClient();
  const [projects, internships, certificates, techStack, coursework] =
    await Promise.all([
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase
        .from("internships")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("certificates")
        .select("*", { count: "exact", head: true }),
      supabase.from("tech_stack").select("*", { count: "exact", head: true }),
      supabase.from("coursework").select("*", { count: "exact", head: true }),
    ]);

  return {
    projects: projects.count ?? 0,
    internships: internships.count ?? 0,
    certificates: certificates.count ?? 0,
    techStack: techStack.count ?? 0,
    coursework: coursework.count ?? 0,
  };
}

export interface InboxCounts {
  unreadMessages: number;
  unreadNotes: number;
}

export async function getUnreadInboxCounts(): Promise<InboxCounts> {
  const supabase = await createClient();
  const [messages, notes] = await Promise.all([
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("private_notes")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  return {
    unreadMessages: messages.count ?? 0,
    unreadNotes: notes.count ?? 0,
  };
}

function mapTechJoin<T extends { id: string }>(
  rows: unknown[] | null,
  joinKey: "project_tech_stack" | "internship_tech_stack"
): (T & { tech_stack: TechStack[] })[] {
  if (!rows) return [];

  return rows.map((row) => {
    const record = row as T & {
      [key: string]: { tech_stack: TechStack }[];
    };
    const joined = record[joinKey] ?? [];
    const { [joinKey]: _omit, ...rest } = record;
    void _omit;
    return {
      ...(rest as unknown as T),
      tech_stack: joined.map((entry) => entry.tech_stack),
    };
  });
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export interface PrivateNoteWithUrl extends PrivateNote {
  imageUrl: string | null;
}

export async function getPrivateNotes(): Promise<PrivateNoteWithUrl[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("private_notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return Promise.all(
    data.map(async (note) => {
      let imageUrl: string | null = null;
      if (note.image_path) {
        const { data: signed } = await supabase.storage
          .from("note-attachments")
          .createSignedUrl(note.image_path, 60 * 60);
        imageUrl = signed?.signedUrl ?? null;
      }
      return { ...note, imageUrl };
    })
  );
}
