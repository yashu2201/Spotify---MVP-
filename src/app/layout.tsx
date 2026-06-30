import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME ?? "Music Buddy",
  description: "AI-native music discovery — tell us what you're in the mood for.",
};

import { Sidebar } from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-brand-dark text-zinc-100 antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
