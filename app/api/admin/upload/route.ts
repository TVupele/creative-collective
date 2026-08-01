import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAdmin();
  if (unauthorized) return unauthorized;

  const form = await req.formData();
  const file = form.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
  }

  const maxBytes = 8 * 1024 * 1024; // 8MB
  if (file.size > maxBytes) {
    return NextResponse.json({ error: "Image must be under 8MB." }, { status: 400 });
  }

  try {
    const blob = await put(`products/${Date.now()}-${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Image upload failed:", err);
    return NextResponse.json(
      { error: "Upload failed. Check that BLOB_READ_WRITE_TOKEN is configured." },
      { status: 502 }
    );
  }
}
