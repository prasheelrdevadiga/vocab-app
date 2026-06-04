// components/NavBar.js
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const path = usePathname();
  const links = [
    { href: "/", label: "🏠 Home" },
    { href: "/history", label: "📚 History" },
    { href: "/practice", label: "🧠 Practice" },
  ];

  return (
    <nav style={{
      display: "flex", justifyContent: "center", gap: 8,
      padding: "16px 20px", borderBottom: "1px solid var(--border)",
      background: "var(--surface)", position: "sticky", top: 0, zIndex: 100,
    }}>
      {links.map((l) => (
        <Link key={l.href} href={l.href} style={{
          padding: "8px 20px", borderRadius: 50,
          background: path === l.href ? "var(--accent)" : "var(--card)",
          color: path === l.href ? "#0f0e17" : "var(--muted)",
          textDecoration: "none", fontSize: 14, fontWeight: path === l.href ? 700 : 400,
          border: "1px solid var(--border)", transition: "all 0.2s",
        }}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}