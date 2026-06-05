// app/layout.js
import "./globals.css";
import NavBar from "@/components/NavBar";
import AuthGuard from "@/components/AuthGuard";

export const metadata = { title: "WordSmith — Vocabulary Builder" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <NavBar />
          <main style={{ maxWidth:780, margin:"0 auto", padding:"28px 16px" }}>
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  );
}