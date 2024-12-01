"use client";

import NavBar from "@/components/NavBar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="px-16 py-8">
      <NavBar />
      {children}
    </div>
  );
}
