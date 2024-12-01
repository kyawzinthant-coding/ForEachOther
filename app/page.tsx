"use client";
import userStore from "@/store/userStore";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = userStore();

  if (!user) {
    return redirect("/login");
  }
  if (user) {
    return redirect("/home");
  }
}
