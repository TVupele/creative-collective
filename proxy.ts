export { auth as proxy } from "@/auth";

export const config = {
  // Only the admin dashboard runs through auth — the public storefront,
  // hero page, and registration flow are untouched.
  matcher: ["/admin/dashboard/:path*"],
};
