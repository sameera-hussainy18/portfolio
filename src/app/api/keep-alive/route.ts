import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// Called once a day by the Vercel Cron Job in vercel.json. Supabase pauses free
// projects after about a week without activity, which empties every page.
export async function GET() {
  const supabase = await createClient();
  const { error } = await supabase.from("tech_stack").select("id").limit(1);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
