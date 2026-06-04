// app/page.js
"use client";
import { saveWord } from "@/lib/storage";
import { WORD_CATEGORIES, getRandomWord } from "@/lib/wordList";
import { useCallback, useEffect, useState } from "react";

const difficultyConfig = {
  easy:     { label: "Easy",     color: "#06d6a0", desc: "Everyday words" },
  medium:   { label: "Medium",   color: "#f7c59f", desc: "Intermediate"   },
  advanced: { label: "Advanced", color: "#ef476f", desc: "Sophisticated"  },
};

export default function Home() {
  const [vocab, setVocab]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [difficulty, setDiff]   = useState("medium");
  const [seen, setSeen]         = useState(0);
  const [copied, setCopied]     = useState(false);
  const [visible, setVisible]   = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [useLocal, setUseLocal] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("use_local_dict") === "true";
    return false;
  });

  const [category, setCategory] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("word_category") || "everyday";
    return "everyday";
  });
  const fetchWord = useCallback(async (diff, localMode, cat) => {
    const d = diff ?? difficulty;
    const lm = localMode ?? useLocal;
    const c = cat ?? category;

    setLoading(true);
    setVisible(false);

    window.speechSynthesis?.cancel();

    try {
      const history = JSON.parse(
        localStorage.getItem("vocab_history") || "[]"
      );

      const seenWords = history
        .map(w => w.word?.toLowerCase())
        .filter(Boolean);

      let url = `/api/vocabulary?difficulty=${d}&t=${Date.now()}`;

      if (lm) {
        const word = getRandomWord(c, d, seenWords);

        url += `&word=${encodeURIComponent(word)}&mode=local`;
      } else {
        url += `&mode=ai&seen=${encodeURIComponent(
          JSON.stringify(seenWords.slice(0, 50))
        )}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!data.error) {
        saveWord(data);
        setSeen(s => s + 1);
      }

      setVocab(data);

      setTimeout(() => setVisible(true), 60);
    } catch {
      setVocab({ error: "Network error. Try again." });
    }

    setLoading(false);
  }, [difficulty, useLocal, category]);

  useEffect(() => { fetchWord("medium"); }, []);

  // ── Stop speech when page unloads ──
  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const handleDiff = (d) => { setDiff(d); fetchWord(d); };

  const handleCopy = () => {
    if (!vocab?.word) return;
    navigator.clipboard.writeText(
      `Word: ${vocab.word}\nMeaning: ${vocab.meaning}\n\nExamples:\n${vocab.examples?.join("\n")}`
    );
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const handlePDF = () => {
    if (!vocab?.word) return;
    const win = window.open("", "_blank");
    win.document.write(generatePDFHTML([vocab]));
    win.document.close();
    win.print();
  };

  // ── Text-to-Speech ──
  const speak = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    // Speak the word first, then its pronunciation guide
    const fullText = vocab?.pronunciation
      ? `${text}. Pronunciation: ${vocab.pronunciation}`
      : text;

    const utter = new SpeechSynthesisUtterance(fullText);
    utter.lang  = "en-US";
    utter.rate  = 0.75;  // slower = clearer
    utter.pitch = 1;

    utter.onstart = () => setSpeaking(true);
    utter.onend   = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);

    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v =>
      v.lang.startsWith("en") && v.name.toLowerCase().includes("female")
    ) || voices.find(v => v.lang.startsWith("en-US"))
      || voices.find(v => v.lang.startsWith("en"));
    if (englishVoice) utter.voice = englishVoice;

    window.speechSynthesis.speak(utter);
  };

  // Chrome bug fix — voices load async
  useEffect(() => {
    window.speechSynthesis?.getVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", () => {
      window.speechSynthesis.getVoices();
    });
  }, []);

  const cfg = difficultyConfig[difficulty];

  return (
    <div>
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <div style={{ fontSize:12, letterSpacing:4, color:"var(--muted)", textTransform:"uppercase", marginBottom:6 }}>
          Daily Vocabulary
        </div>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,6vw,3rem)", fontWeight:900 }}>
          Word<span style={{ color:"var(--accent)" }}>Smith</span>
        </h1>
        <p style={{ color:"var(--muted)", fontSize:13, marginTop:6 }}>
          {seen > 0 ? `${seen} word${seen>1?"s":""} explored` : "Expand your vocabulary, one word at a time"}
        </p>
      </div>

      {/* Difficulty Selector */}
      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:28, flexWrap:"wrap" }}>
        {Object.entries(difficultyConfig).map(([key, val]) => (
          <button key={key} onClick={() => handleDiff(key)} style={{
            padding:"9px 22px", borderRadius:50, cursor:"pointer",
            border:`2px solid ${difficulty===key ? val.color : "var(--border)"}`,
            background: difficulty===key ? val.color+"22" : "var(--surface)",
            color: difficulty===key ? val.color : "var(--muted)",
            fontWeight: difficulty===key ? 700 : 400, fontSize:14,
            fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
          }}>
            {val.label} <span style={{ fontSize:11, opacity:0.7 }}>{val.desc}</span>
          </button>
        ))}
      </div>
      {/* ── Local Dictionary Mode Toggle ── */}
<div style={{
  background:"var(--surface)",
  border:"1px solid var(--border)",
  borderRadius:16,
  padding:"16px 20px",
  marginBottom:24
}}>
  <div style={{
    display:"flex",
    alignItems:"center",
    justifyContent:"space-between",
    marginBottom: useLocal ? 16 : 0
  }}>
    <div>
      <p style={{
        fontSize:14,
        fontWeight:600,
        color:"var(--text)"
      }}>
        📖 Local Dictionary Mode
      </p>

      <p style={{
        fontSize:12,
        color:"var(--muted)",
        marginTop:2
      }}>
        {useLocal
          ? `Category: ${WORD_CATEGORIES[category]?.label}`
          : "AI picks the word freely"}
      </p>
    </div>

    <div
      onClick={handleToggleLocal}
      style={{
        width:52,
        height:28,
        borderRadius:14,
        cursor:"pointer",
        position:"relative",
        background: useLocal
          ? "var(--accent)"
          : "var(--border)"
      }}
    >
      <div
        style={{
          position:"absolute",
          top:3,
          left: useLocal ? 27 : 3,
          width:22,
          height:22,
          borderRadius:"50%",
          background:"white"
        }}
      />
    </div>
  </div>

  {useLocal && (
    <>
      <p style={{
        fontSize:11,
        color:"var(--muted)",
        letterSpacing:2,
        textTransform:"uppercase",
        marginBottom:8
      }}>
        Category
      </p>

      <div style={{
        display:"flex",
        gap:8,
        flexWrap:"wrap",
        marginBottom:14
      }}>
        {Object.entries(WORD_CATEGORIES).map(([key,val]) => (
          <button
            key={key}
            onClick={() => handleCategory(key)}
          >
            {val.label}
          </button>
        ))}
      </div>
    </>
  )}
</div>
      {/* Card */}
      <div style={{
        background:"var(--card)", borderRadius:20, border:"1px solid var(--border)",
        minHeight:400, overflow:"hidden",
        opacity: loading ? 0.5 : visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition:"opacity 0.4s, transform 0.4s",
      }}>
        {loading && <Spinner color={cfg.color} />}

        {!loading && vocab && !vocab.error && (
          <>
            {/* Word Header */}
            <div style={{
              padding:"28px 28px 20px",
              borderBottom:"1px solid var(--border)",
              background:`linear-gradient(135deg,${cfg.color}11,transparent)`,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div>
                  <span style={{ fontSize:11, letterSpacing:3, textTransform:"uppercase", color:cfg.color, fontWeight:600, display:"block", marginBottom:6 }}>
                    {vocab.partOfSpeech} · {difficulty}
                  </span>
                  <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2rem,7vw,3.2rem)", fontWeight:900, lineHeight:1 }}>
                    {vocab.word}
                  </h2>
                  {vocab.pronunciation && (
                    <p style={{ color:"var(--muted)", fontSize:14, marginTop:5, fontStyle:"italic" }}>{vocab.pronunciation}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display:"flex", gap:8, alignItems:"flex-start", flexWrap:"wrap" }}>
                  <SmallBtn onClick={handleCopy} color={copied ? "#06d6a0" : "var(--muted)"}>
                    {copied ? "✓ Copied" : "Copy"}
                  </SmallBtn>

                  {/* 🔊 Listen Button */}
                  <button
                    onClick={() => speak(vocab.word)}
                    style={{
                      padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13,
                      fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
                      border: speaking ? "1px solid #60a5fa" : "1px solid var(--border)",
                      background: speaking ? "#60a5fa22" : "var(--surface)",
                      color: speaking ? "#60a5fa" : "#60a5fa",
                      display:"flex", alignItems:"center", gap:5,
                    }}
                  >
                    {speaking ? (
                      <>
                        <span style={{ display:"inline-flex", gap:2, alignItems:"center" }}>
                          {/* animated sound bars */}
                          {[1,2,3].map(i => (
                            <span key={i} style={{
                              display:"inline-block", width:3, borderRadius:2,
                              background:"#60a5fa",
                              height: `${6 + i * 3}px`,
                              animation:`soundBar 0.6s ease-in-out ${i*0.15}s infinite alternate`,
                            }} />
                          ))}
                        </span>
                        Speaking…
                      </>
                    ) : "🔊 Listen"}
                  </button>

                  <SmallBtn onClick={handlePDF} color="#a78bfa">⬇ PDF</SmallBtn>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div style={{ padding:"24px 28px" }}>
              <Section title="Meaning" accent={cfg.color}>
                <p style={{ lineHeight:1.7, fontSize:16 }}>{vocab.meaning}</p>
              </Section>
              <Section title="Detailed Explanation" accent={cfg.color}>
                <p style={{ color:"#c8c9d9", lineHeight:1.8, fontSize:15 }}>{vocab.explanation}</p>
              </Section>
              <Section title="Examples" accent={cfg.color}>
                <ol style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:10 }}>
                  {vocab.examples?.map((ex, i) => (
                    <li key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <span style={{ minWidth:24, height:24, borderRadius:"50%", background:cfg.color+"22", color:cfg.color, fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", marginTop:2 }}>{i+1}</span>
                      <p style={{ color:"#b0b2c8", lineHeight:1.65, fontSize:15 }}>{ex}</p>
                    </li>
                  ))}
                </ol>
              </Section>
              <div style={{ display:"flex", gap:20, flexWrap:"wrap" }}>
                <TagGroup label="Synonyms" items={vocab.synonyms} color={cfg.color} />
                <TagGroup label="Antonyms" items={vocab.antonyms} color="#ef476f" />
              </div>
            </div>
          </>
        )}
        {!loading && vocab?.error && <ErrorMsg msg={vocab.error} />}
      </div>

      {/* Next Button */}
      <div style={{ textAlign:"center", marginTop:24 }}>
        <button onClick={() => fetchWord()} disabled={loading} style={{
          padding:"15px 48px", borderRadius:50, border:"none",
          background: loading ? "var(--border)" : `linear-gradient(135deg,${cfg.color},${cfg.color}bb)`,
          color: loading ? "var(--muted)" : "#0f0e17",
          fontSize:16, fontWeight:700, fontFamily:"'DM Sans',sans-serif",
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : `0 8px 28px ${cfg.color}44`,
          transition:"all 0.2s",
        }}>
          {loading ? "Loading…" : "Next Word →"}
        </button>
      </div>

      {/* Sound bar animation */}
      <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.4); }
        }
      `}</style>
    </div>
  );
}

// ─── Shared Small Components ─────────────────────────────────────────────
function SmallBtn({ onClick, color, children }) {
  return (
    <button onClick={onClick} style={{
      padding:"7px 14px", borderRadius:8, border:"1px solid var(--border)",
      background:"var(--surface)", color, cursor:"pointer", fontSize:13,
      fontFamily:"'DM Sans',sans-serif", transition:"all 0.2s",
    }}>{children}</button>
  );
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom:22 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
        <div style={{ width:3, height:15, borderRadius:2, background:accent }} />
        <p style={{ fontSize:11, letterSpacing:2, color:"var(--muted)", textTransform:"uppercase", fontWeight:600 }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function TagGroup({ label, items, color }) {
  if (!items?.length) return null;
  return (
    <div style={{ flex:1, minWidth:140 }}>
      <p style={{ fontSize:11, letterSpacing:2, color:"var(--muted)", textTransform:"uppercase", marginBottom:6 }}>{label}</p>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {items.map((s,i) => (
          <span key={i} style={{ padding:"4px 12px", borderRadius:20, background:color+"18", color, fontSize:13 }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function Spinner({ color }) {
  return (
    <div style={{ padding:80, textAlign:"center" }}>
      <div style={{ width:44, height:44, borderRadius:"50%", border:"3px solid var(--border)", borderTop:`3px solid ${color}`, animation:"spin 0.8s linear infinite", margin:"0 auto 14px" }} />
      <p style={{ color:"var(--muted)", fontSize:14 }}>Finding a great word…</p>
    </div>
  );
}

function ErrorMsg({ msg }) {
  return (
    <div style={{ padding:60, textAlign:"center", color:"var(--muted)" }}>
      <p style={{ fontSize:36, marginBottom:10 }}>⚠️</p>
      <p>{msg}</p>
    </div>
  );
}

// ─── PDF Generator ────────────────────────────────────────────────────────
export function generatePDFHTML(words) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>WordSmith Vocabulary</title>
  <style>
    body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; color: #1a1a2e; line-height: 1.6; }
    h1 { font-size: 2rem; border-bottom: 3px solid #ff6b35; padding-bottom: 8px; margin-bottom: 24px; }
    .word-card { border: 1px solid #ddd; border-radius: 10px; padding: 24px; margin-bottom: 32px; page-break-inside: avoid; }
    .word-title { font-size: 2rem; font-weight: 900; margin-bottom: 4px; }
    .meta { color: #888; font-size: 13px; margin-bottom: 12px; }
    .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #ff6b35; font-weight: 700; margin: 14px 0 4px; }
    .example-list { padding-left: 18px; }
    .example-list li { margin-bottom: 6px; color: #444; }
    .tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
    .tag { background: #f0f0f0; padding: 3px 10px; border-radius: 20px; font-size: 12px; }
    @media print { .word-card { break-inside: avoid; } }
  </style></head><body>
  <h1>📖 WordSmith — My Vocabulary</h1>
  <p style="color:#888; margin-bottom:28px;">Generated on ${new Date().toLocaleDateString()}</p>
  ${words.map(w => `
    <div class="word-card">
      <div class="word-title">${w.word || ""}</div>
      <div class="meta">${w.pronunciation || ""} · ${w.partOfSpeech || ""} · ${w.difficulty || ""}</div>
      <div class="label">Meaning</div>
      <p>${w.meaning || ""}</p>
      <div class="label">Explanation</div>
      <p>${w.explanation || ""}</p>
      <div class="label">Examples</div>
      <ol class="example-list">${(w.examples||[]).map(e => `<li>${e}</li>`).join("")}</ol>
      ${w.synonyms?.length ? `<div class="label">Synonyms</div><div class="tags">${w.synonyms.map(s=>`<span class="tag">${s}</span>`).join("")}</div>` : ""}
      ${w.antonyms?.length ? `<div class="label">Antonyms</div><div class="tags">${w.antonyms.map(s=>`<span class="tag">${s}</span>`).join("")}</div>` : ""}
      ${w.seenAt ? `<p style="color:#aaa;font-size:12px;margin-top:12px;">Seen: ${new Date(w.seenAt).toLocaleString()}</p>` : ""}
    </div>
  `).join("")}
  </body></html>`;
}