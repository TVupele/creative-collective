import type { Metadata } from "next";
import { Poppins, Inter, IBM_Plex_Mono } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import { CartProvider } from "@/lib/cart-context";
import "./globals.css";

const display = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Creative Collective — Road to FESTAC@50",
  description:
    "Creative Collective is the platform through which creatives across Africa and the Black Diaspora participate in the Road to FESTAC and FESTAC@50.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} font-mono bg-ink text-ink antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <a
              href="/shop"
              className="fixed bottom-4 right-4 z-50 rounded-full bg-amber px-5 py-3 font-mono text-sm font-semibold text-ink shadow-lg transition hover:bg-gold"
            >
              Shop
            </a>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
