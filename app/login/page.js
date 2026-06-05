// app/login/page.js
"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { syncLocalToSupabase } from "@/lib/userStorage";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode]       = useState("login"); // "login" | "signup"
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setSuccess(""); setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields."); setLoading(false); return;
    }
    if (mode === "signup" && !name.trim()) {
      setError("Please enter your name."); setLoading(false); return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters."); setLoading(false); return;
    }

    if (mode === "signup") {
      const { error: err } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name.trim() } },
      });
      if (err) { setError(err.message); setLoading(false); return; }
      setSuccess("Account created! You are now logged in.");
      await syncLocalToSupabase();
      setTimeout(() => router.push("/"), 1500);
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError("Invalid email or password."); setLoading(false); return; }
      await syncLocalToSupabase();
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
      background:"var(--bg)", padding:"20px",
    }}>
      <div style={{
        width:"100%", maxWidth:420,
        background:"var(--surface)", border:"1px solid var(--border)",
        borderRadius:20, padding:"36px 32px",
      }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:900, margin:0 }}>
            Word<span style={{ color:"var(--accent)" }}>Smith</span>
          </h1>
          <p style={{ color:"var(--muted)", fontSize:13, marginTop:6 }}>
            {mode === "login" ? "Welcome back!" : "Create your free account"}
          </p>
        </div>

        {/* Tab toggle */}
        <div style={{
          display:"flex", background:"var(--card)", borderRadius:12,
          padding:4, marginBottom:24, gap:4,
        }}>
          {["login","signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{
                flex:1, padding:"10px", borderRadius:9, border:"none",
                background: mode===m ? "var(--accent)" : "transparent",
                color: mode===m ? "#0f0e17" : "var(--muted)",
                fontWeight: mode===m ? 700 : 400, fontSize:14, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
              }}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {mode === "signup" && (
            <div>
              <label style={{ fontSize:12, color:"var(--muted)", display:"block", marginBottom:4 }}>Your Name</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Prashant"
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize:12, color:"var(--muted)", display:"block", marginBottom:4 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)}
              type="email" placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize:12, color:"var(--muted)", display:"block", marginBottom:4 }}>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)}
              type="password" placeholder="Min 6 characters"
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Error / Success */}
        {error   && <p style={{ color:"#ef476f", fontSize:13, marginTop:12 }}>⚠️ {error}</p>}
        {success && <p style={{ color:"#06d6a0", fontSize:13, marginTop:12 }}>✅ {success}</p>}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} style={{
          width:"100%", marginTop:20, padding:"14px",
          borderRadius:12, border:"none",
          background: loading ? "var(--border)" : "var(--accent)",
          color: loading ? "var(--muted)" : "#0f0e17",
          fontSize:15, fontWeight:700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
        }}>
          {loading ? "Please wait…" : mode === "login" ? "Log In →" : "Create Account →"}
        </button>

        <p style={{ textAlign:"center", fontSize:12, color:"var(--muted)", marginTop:16 }}>
          {mode === "login" ? "No account? " : "Already have one? "}
          <span onClick={() => { setMode(mode==="login"?"signup":"login"); setError(""); }}
            style={{ color:"var(--accent)", cursor:"pointer" }}>
            {mode === "login" ? "Sign up free" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width:"100%", padding:"11px 14px", borderRadius:10,
  border:"1px solid var(--border)", background:"var(--card)",
  color:"var(--text)", fontSize:14, fontFamily:"'DM Sans',sans-serif",
  outline:"none", boxSizing:"border-box",
};