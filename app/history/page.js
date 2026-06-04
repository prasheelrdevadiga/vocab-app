// app/history/page.js
"use client";
import { generatePDFHTML } from "@/app/page";
import { clearHistory, getHistory } from "@/lib/storage";
import { useEffect, useState } from "react";

const FILTERS = [10, 25, 50, 100, "All"];
const diffColor = { easy:"#06d6a0", medium:"#f7c59f", advanced:"#ef476f" };

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filter, setFilter]   = useState(25);
  const [expand, setExpand]   = useState(null);
  const [search, setSearch]   = useState("");

  useEffect(() => { setHistory(getHistory()); }, []);
 
  const displayed = history
    .filter(w => w.word?.toLowerCase().includes(search.toLowerCase()))
    .slice(0, filter === "All" ? 9999 : filter);

  const handleClear = () => {
    if (confirm("Clear all history?")) { clearHistory(); setHistory([]); }
  };

  const handlePDF = () => {
    const win = window.open("", "_blank");
    win.document.write(generatePDFHTML(displayed));
    win.document.close(); win.print();
  };
  const speak = (text) => {
  if (!text) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = 0.8;
  utter.pitch = 1;
  window.speechSynthesis.speak(utter);
};

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2rem", fontWeight:900, marginBottom:4 }}>
          📚 My Word History
        </h2>
        <p style={{ color:"var(--muted)", fontSize:14 }}>{history.length} words explored so far</p>
      </div>

      {/* Controls */}
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:20, alignItems:"center" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search words…"
          style={{ flex:1, minWidth:160, padding:"9px 14px", borderRadius:10, border:"1px solid var(--border)", background:"var(--surface)", color:"var(--text)", fontSize:14, fontFamily:"'DM Sans',sans-serif", outline:"none" }}
        />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding:"8px 16px", borderRadius:50, cursor:"pointer", fontSize:13,
            border:`1.5px solid ${filter===f ? "var(--accent)" : "var(--border)"}`,
            background: filter===f ? "var(--accent)22" : "var(--surface)",
            color: filter===f ? "var(--accent)" : "var(--muted)",
            fontFamily:"'DM Sans',sans-serif",
          }}>
            Last {f}
          </button>
        ))}
        <button onClick={handlePDF} style={{
          padding:"8px 18px", borderRadius:50, border:"1px solid #a78bfa",
          background:"#a78bfa22", color:"#a78bfa", cursor:"pointer", fontSize:13,
          fontFamily:"'DM Sans',sans-serif",
        }}>⬇ PDF ({displayed.length})</button>
        <button onClick={handleClear} style={{
          padding:"8px 16px", borderRadius:50, border:"1px solid var(--border)",
          background:"var(--surface)", color:"#ef476f", cursor:"pointer", fontSize:13,
          fontFamily:"'DM Sans',sans-serif",
        }}>🗑 Clear All</button>
      </div>

      {/* Word List */}
      {displayed.length === 0 && (
        <div style={{ textAlign:"center", padding:60, color:"var(--muted)" }}>
          <p style={{ fontSize:40, marginBottom:12 }}>📭</p>
          <p>No words yet. Go explore some on the Home page!</p>
        </div>
      )}

      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {displayed.map((w, i) => (
          <div key={i} style={{
            background:"var(--card)", border:"1px solid var(--border)",
            borderRadius:14, overflow:"hidden", cursor:"pointer",
          }} onClick={() => setExpand(expand === i ? null : i)}>
            {/* Summary Row */}
            <div style={{ padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <span style={{
                  fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700,
                  background: (diffColor[w.difficulty]||"#888")+"22",
                  color: diffColor[w.difficulty]||"#888",
                }}>
                  {w.difficulty || "?"}
                </span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", fontWeight:700 }}>{w.word}</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.3rem", fontWeight:700 }}>{w.word}</span>
<button onClick={(e) => { e.stopPropagation(); speak(w.word); }} style={{
  background:"none", border:"1px solid #60a5fa33", borderRadius:8,
  color:"#60a5fa", cursor:"pointer", fontSize:12, padding:"2px 8px"
}}>🔊</button>
                <span style={{ color:"var(--muted)", fontSize:13, fontStyle:"italic" }}>{w.partOfSpeech}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ color:"var(--muted)", fontSize:12 }}>
                  {w.seenAt ? new Date(w.seenAt).toLocaleDateString() : ""}
                </span>
                <span style={{ color:"var(--muted)" }}>{expand===i ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Expanded Detail */}
            {expand === i && (
              <div style={{ borderTop:"1px solid var(--border)", padding:"20px 20px 24px", animation:"fadeUp 0.3s ease" }}>
                <p style={{ color:"var(--muted)", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Meaning</p>
                <p style={{ lineHeight:1.7, marginBottom:14 }}>{w.meaning}</p>
                <p style={{ color:"var(--muted)", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:4 }}>Explanation</p>
                <p style={{ color:"#c8c9d9", lineHeight:1.8, fontSize:15, marginBottom:14 }}>{w.explanation}</p>
                <p style={{ color:"var(--muted)", fontSize:11, letterSpacing:2, textTransform:"uppercase", marginBottom:8 }}>Examples</p>
                <ol style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                  {w.examples?.map((ex, j) => (
                    <li key={j} style={{ display:"flex", gap:10 }}>
                      <span style={{ minWidth:22, height:22, borderRadius:"50%", background:"#ff6b3522", color:"var(--accent)", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{j+1}</span>
                      <p style={{ color:"#b0b2c8", fontSize:14, lineHeight:1.6 }}>{ex}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}