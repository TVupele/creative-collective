import { NextRequest, NextResponse } from "next/server";
import { appendRegistration } from "@/lib/sheets";
import type { Registration } from "@/lib/types";

export async function POST(req: NextRequest) {
  let data: Registration;

  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!data.fullName || !data.email || !data.phone || !data.category) {
    return NextResponse.json(
      { error: "Full name, email, phone and category are required." },
      { status: 400 }
    );
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(data.email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await appendRegistration(data);
  } catch (err) {
    console.error("Failed to save registration:", err);
    return NextResponse.json(
      {
        error:
          "We couldn't save your registration right now. Please try again shortly, or contact us directly.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
