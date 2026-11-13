import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Delete from Vercel Blob
    await del(asset.url);

    // Delete from DB
    await prisma.mediaAsset.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
