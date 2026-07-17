import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/fade-in";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";
import { NoteForm } from "@/components/contact/note-form";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch, or leave a private note.",
  openGraph: {
    title: "Contact",
    description: "Get in touch, or leave a private note.",
    url: "/contact",
    type: "website",
    images: [`/api/og?title=Contact`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact",
    images: [`/api/og?title=Contact`],
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-16 sm:py-24">
      <SectionHeading
        eyebrow="say hi"
        title="Contact"
        description="Reach out directly, send a message, or leave a private note."
      />

      <FadeIn>
        <div className="flex flex-wrap gap-4">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-border inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2.5 text-sm text-foreground"
          >
            <GitHubIcon className="size-4" />
            GitHub
          </Link>
          <Link
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-border inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2.5 text-sm text-foreground"
          >
            <LinkedInIcon className="size-4" />
            LinkedIn
          </Link>
        </div>
      </FadeIn>

      <FadeIn>
        <Card className="glow-border">
          <CardContent>
            <Tabs defaultValue="contact">
              <TabsList className="mb-6 w-full">
                <TabsTrigger value="contact" className="gap-1.5">
                  <Mail className="size-3.5" />
                  Get in Touch
                </TabsTrigger>
                <TabsTrigger value="note" className="gap-1.5">
                  <Lock className="size-3.5" />
                  Leave a Note
                </TabsTrigger>
              </TabsList>
              <TabsContent value="contact">
                <ContactForm />
              </TabsContent>
              <TabsContent value="note">
                <NoteForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
