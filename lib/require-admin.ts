import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Call at the top of any admin-only API route. Returns the session if the
 * request is from a logged-in admin, or a 401 NextResponse to return
 * immediately if not.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return {
      session: null,
      unauthorized: NextResponse.json({ error: "Not authenticated." }, { status: 401 }),
    };
  }
  return { session, unauthorized: null };
}
