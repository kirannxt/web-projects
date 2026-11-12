import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@showcase.com" },
    update: {},
    create: {
      email: "admin@showcase.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("✓ Admin user created:", admin.email);

  // Create sample pages
  const pages = [
    {
      title: "About Us",
      slug: "about-us",
      content: `# About Us\n\nWelcome to our project showcase. We are a team of passionate developers building innovative solutions.\n\n## Our Mission\n\nTo deliver high-quality, impactful software that makes a difference.\n\n## Our Values\n\n- **Innovation**: We embrace new technologies and approaches\n- **Quality**: We take pride in clean, maintainable code\n- **Collaboration**: We work together to achieve great results`,
      parentMenu: "Company",
      order: 0,
    },
    {
      title: "Our Team",
      slug: "our-team",
      content: `# Our Team\n\nMeet the talented individuals behind our projects.\n\n## Leadership\n\n- **Jane Doe** - Founder & CEO\n- **John Smith** - CTO\n- **Sarah Johnson** - Lead Designer\n\n## Development\n\nOur development team consists of experienced engineers with expertise in modern web technologies.`,
      parentMenu: "Company",
      order: 1,
    },
    {
      title: "Web Apps",
      slug: "web-apps",
      content: `# Web Applications\n\nExplore our portfolio of web application projects built with modern technologies.\n\n## Technologies We Use\n\n- **Frontend**: Next.js, React, TypeScript\n- **Backend**: Node.js, Python, Go\n- **Database**: PostgreSQL, MongoDB, SQLite\n- **Cloud**: AWS, Vercel, Railway`,
      parentMenu: "Projects",
      order: 0,
    },
    {
      title: "Mobile Apps",
      slug: "mobile-apps",
      content: `# Mobile Applications\n\nOur mobile development projects spanning iOS and Android platforms.\n\n## Platforms\n\n- **iOS**: Swift, SwiftUI\n- **Android**: Kotlin, Jetpack Compose\n- **Cross-platform**: React Native, Flutter`,
      parentMenu: "Projects",
      order: 1,
    },
    {
      title: "Open Source",
      slug: "open-source",
      content: `# Open Source\n\nWe believe in giving back to the community. Here are our open source contributions.\n\n## Libraries\n\nWe maintain several popular open source libraries used by thousands of developers worldwide.\n\n## Contributing\n\nWe welcome contributions from the community. Check out our GitHub organization for open issues.`,
      parentMenu: "Projects",
      order: 2,
    },
  ];

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
    console.log(`✓ Page created: ${page.title}`);
  }

  // Create sample projects
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution built with Next.js, Stripe payments, and PostgreSQL. Features real-time inventory management and analytics dashboard.",
      imageUrl: null,
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/example/ecommerce",
      tags: JSON.stringify(["Next.js", "TypeScript", "Stripe", "PostgreSQL"]),
      featured: true,
      order: 0,
    },
    {
      title: "Task Management App",
      description:
        "A collaborative project management tool with drag-and-drop boards, real-time updates, and team collaboration features.",
      imageUrl: null,
      demoUrl: "https://tasks.example.com",
      repoUrl: "https://github.com/example/tasks",
      tags: JSON.stringify(["React", "Node.js", "WebSockets", "MongoDB"]),
      featured: true,
      order: 1,
    },
    {
      title: "AI Content Generator",
      description:
        "A web application that uses AI to generate and optimize content for blogs, social media, and marketing materials.",
      imageUrl: null,
      demoUrl: null,
      repoUrl: "https://github.com/example/ai-content",
      tags: JSON.stringify(["Python", "FastAPI", "OpenAI", "React"]),
      featured: false,
      order: 2,
    },
    {
      title: "DevOps Dashboard",
      description:
        "A monitoring and deployment dashboard for containerized applications with Kubernetes integration and CI/CD pipeline visualization.",
      imageUrl: null,
      demoUrl: null,
      repoUrl: null,
      tags: JSON.stringify(["Go", "Kubernetes", "Docker", "Vue.js"]),
      featured: false,
      order: 3,
    },
  ];

  for (const project of projects) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title },
    });
    if (!existing) {
      await prisma.project.create({ data: project });
      console.log(`✓ Project created: ${project.title}`);
    }
  }

  console.log("\nSeeding complete!");
  console.log("Admin login: admin@showcase.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
