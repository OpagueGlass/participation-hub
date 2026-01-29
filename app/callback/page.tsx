"use client";

import { useAuth } from "@/context/auth-context";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { session, loadIsResearcher } = useAuth();

  if (!session) {
    redirect("/login");
  }

  useEffect(() => {
    const handleCallback = async () => {
      if (session.user.user_metadata.hasPassword) {
        const res = await loadIsResearcher(session.user.id);
        if (res) {
          redirect("/admin");
        } else {
          redirect("/dashboard");
        }
      } else {
        redirect("/signup");
      }
    };
    handleCallback();
  }, []);
}
