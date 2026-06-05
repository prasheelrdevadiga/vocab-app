// components/NavBar.js
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function NavBar() {
  const path   = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (path === "/login") return null;

  const links = [
    { href: "/",         label: "🏠 Home"     },
    { href: "/history",  label: "📚 History"  },
    { href: "/practice", label: "🧠 Practice"  },
    { href: "/wordlist", label: "📝 My List"   },
  ];

  return (
    <nav style={{
      display:"flex", justifyContent:"space-between", alignItems:"center",
      padding:"12px 20px", borderBottom:"1px solid var(--border)",
      background:"var(--surface)", position:"sticky", top:0, zIndex:100,
      flexWrap:"wrap", gap:8,
    }}>
      {/* Nav links */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            padding:"7px 16px", borderRadius:50,
            background: path === l.href ? "var(--accent)" : "var(--card)",
            color: path === l.href ? "#0f0e17" : "var(--muted)",
            textDecoration:"none", fontSize:13,
            fontWeight: path === l.href ? 700 : 400,
            border:"1px solid var(--border)", transition:"all 0.2s",
          }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* User info + logout */}
      {user && (
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:13, color:"var(--muted)" }}>
            👤 {user.user_metadata?.full_name || user.email?.split("@")[0]}
          </span>
          <button onClick={handleLogout} style={{
            padding:"6px 14px", borderRadius:50, cursor:"pointer", fontSize:12,
            background:"var(--card)", border:"1px solid var(--border)",
            color:"#ef476f", fontFamily:"'DM Sans',sans-serif",
          }}>
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}