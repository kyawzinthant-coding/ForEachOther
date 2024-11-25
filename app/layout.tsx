import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For Each Other",
  description: "For only us to share out love letters",
};

export const viewport: Viewport = {
  themeColor: [{ color: "white", media: "(prefers-color-scheme: light)" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body className="bg-lines antialiased  h-full bg-gradient-to-r from-[#F3F6FF] to-white font-nunito overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
