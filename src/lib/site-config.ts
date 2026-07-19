export const siteConfig = {
  name: "Pattan Sameera Hussainy",
  tagline:
    "B.Tech Computer Science & Business Systems, SASTRA University — Class of 2027",
  bio: "Hi, I'm Pattan Sameera Hussainy — a Computer Science and Business Systems student at SASTRA University with a minor in Supply Chain & Project Management. I enjoy exploring how technology and business can work together to create innovative solutions, and I'm always eager to learn new skills that push me to think creatively. My goal is to grow into a versatile professional who can design efficient systems, contribute to impactful projects, and bridge the gap between technology and business.",
  description:
    "Portfolio of Pattan Sameera Hussainy — B.Tech Computer Science & Business Systems student at SASTRA University. Projects, internships, certificates, and tech stack.",
  location: "Nellore, Andhra Pradesh, India",
  profileImage: "/profile.jpg",
  academics: {
    cgpa: 9.27,
    semestersCompleted: 6,
    totalSemesters: 8,
    progressPercent: 80,
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  links: {
    github: "https://github.com/sameera-hussainy18",
    linkedin:
      "https://www.linkedin.com/in/sameera-hussainy-pattan-76214027a/",
  },
} as const;
