// components/AuthGuard.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const [checking, setChecking] = useState(true);
  const [user, setUser]         = useState(null);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setChecking(false);
      if (!user && pathname !== "/login") {
        router.push("/login");
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user && pathname !== "/login") {
        router.push("/login");
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"var(--bg)", color:"var(--muted)", fontFamily:"'DM Sans',sans-serif",
    }}>
      Loading…
    </div>
  );

  return children;
}