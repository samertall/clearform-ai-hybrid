import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "ClearForm AI — Complex information, simply explained",
  description: "A privacy-conscious form comprehension tool powered by Firebase AI Logic hybrid inference.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
