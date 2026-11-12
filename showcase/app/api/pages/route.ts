import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      where: { published: true },
      orderBy: [{ parentMenu: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(pages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, content, parentMenu, order, published } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Sanitize slug
    const cleanSlug = slug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const page = await prisma.page.create({
      data: {
        title,
        slug: cleanSlug,
        content,
        parentMenu: parentMenu || "Projects",
        order: order || 0,
        published: published !== undefined ? published : true,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error: unknown) {
    if ((error as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 });
  }
}
