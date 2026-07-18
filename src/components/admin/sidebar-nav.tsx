"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  ShieldCheck,
  Code2,
  GraduationCap,
  Mail,
  Lock,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/internships", label: "Internships", icon: Briefcase },
  { href: "/admin/certificates", label: "Certificates", icon: ShieldCheck },
  { href: "/admin/tech-stack", label: "Tech Stack", icon: Code2 },
  { href: "/admin/coursework", label: "Coursework", icon: GraduationCap },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/notes", label: "Notes", icon: Lock },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <>
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-border/60 p-4 md:flex">
        <span className="mb-4 px-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Admin
        </span>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                isActive && "bg-accent text-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <LogOut className="size-4" />
          Log Out
        </button>
      </aside>

      <div className="flex gap-1 overflow-x-auto border-b border-border/60 p-3 md:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 font-mono text-xs text-muted-foreground",
                isActive && "border-primary/50 bg-accent text-foreground"
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 font-mono text-xs text-muted-foreground"
        >
          <LogOut className="size-3.5" />
          Log Out
        </button>
      </div>
    </>
  );
}
