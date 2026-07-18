export type TechCategory =
  | "language"
  | "framework"
  | "database"
  | "tool"
  | "cloud"
  | "other";

export type CourseCategory = "cs" | "business";

export interface Database {
  public: {
    Tables: {
      tech_stack: {
        Row: {
          id: string;
          name: string;
          category: TechCategory;
          icon_slug: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: TechCategory;
          icon_slug?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tech_stack"]["Insert"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string;
          description: string | null;
          github_url: string | null;
          live_url: string | null;
          image_url: string | null;
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          summary: string;
          description?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          image_url?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      project_tech_stack: {
        Row: { project_id: string; tech_stack_id: string };
        Insert: { project_id: string; tech_stack_id: string };
        Update: Partial<
          Database["public"]["Tables"]["project_tech_stack"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "project_tech_stack_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_tech_stack_tech_stack_id_fkey";
            columns: ["tech_stack_id"];
            isOneToOne: false;
            referencedRelation: "tech_stack";
            referencedColumns: ["id"];
          },
        ];
      };
      internships: {
        Row: {
          id: string;
          company: string;
          role: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["internships"]["Insert"]
        >;
        Relationships: [];
      };
      internship_tech_stack: {
        Row: { internship_id: string; tech_stack_id: string };
        Insert: { internship_id: string; tech_stack_id: string };
        Update: Partial<
          Database["public"]["Tables"]["internship_tech_stack"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "internship_tech_stack_internship_id_fkey";
            columns: ["internship_id"];
            isOneToOne: false;
            referencedRelation: "internships";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "internship_tech_stack_tech_stack_id_fkey";
            columns: ["tech_stack_id"];
            isOneToOne: false;
            referencedRelation: "tech_stack";
            referencedColumns: ["id"];
          },
        ];
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          issue_date: string;
          credential_url: string | null;
          credential_id: string | null;
          image_url: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          issue_date: string;
          credential_url?: string | null;
          credential_id?: string | null;
          image_url?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["certificates"]["Insert"]
        >;
        Relationships: [];
      };
      coursework: {
        Row: {
          id: string;
          category: CourseCategory;
          semester: number;
          course_code: string;
          course_title: string;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category: CourseCategory;
          semester: number;
          course_code: string;
          course_title: string;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["coursework"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["contact_messages"]["Insert"]
        >;
        Relationships: [];
      };
      private_notes: {
        Row: {
          id: string;
          name: string | null;
          message: string;
          image_path: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          message: string;
          image_path?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["private_notes"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type TechStack = Database["public"]["Tables"]["tech_stack"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Internship = Database["public"]["Tables"]["internships"]["Row"];
export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
export type CourseWork = Database["public"]["Tables"]["coursework"]["Row"];
export type ContactMessage =
  Database["public"]["Tables"]["contact_messages"]["Row"];
export type PrivateNote = Database["public"]["Tables"]["private_notes"]["Row"];

export type ProjectWithTech = Project & { tech_stack: TechStack[] };
export type InternshipWithTech = Internship & { tech_stack: TechStack[] };
