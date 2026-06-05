// app/wordlist/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function WordListPage() {
  const [inputText, setInputText]   = useState("");
  const [savedList, setSavedList]   = useState([]);
  const [message, setMessage]       = useState("");
  const [previewWords, setPreviewWords] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("custom_word_list") || "[]");
    setSavedList(stored);
  }, []);

  const parseWords = (text) => {
    return text
      .split(",")
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 1 && /^[a-zA-Z\s\-]+$/.test(w));
  };

  const handlePreview = () => {
    const words = parseWords(inputText);
    setPreviewWords(words);
  };

  const handleSave = () => {
    const newWords = parseWords(inputText);
    if (newWords.length === 0) {
      setMessage("⚠️ No valid words found. Make sure words are separated by commas.");
      return;
    }
    // Merge with existing, no duplicates
    const merged = [...new Set([...savedList, ...newWords])];
    localStorage.setItem("custom_word_list", JSON.stringify(merged));
    setSavedList(merged);
    setInputText("");
    setPreviewWords([]);
    setMessage(`✅ Added ${newWords.length} words! Your list now has ${merged.length} words.`);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleClearAll = () => {
    if (!confirm("Clear your entire custom word list? This cannot be undone.")) return;
    localStorage.removeItem("custom_word_list");
    setSavedList([]);
    setMessage("🗑️ Custom word list cleared.");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRemoveWord = (word) => {
    const updated = savedList.filter(w => w !== word);
    localStorage.setItem("custom_word_list", JSON.stringify(updated));
    setSavedList(updated);
  };

  const studiedCount = () => {
    const history = JSON.parse(localStorage.getItem("vocab_history") || "[]");
    const seenWords = history.map(w => w.word?.toLowerCase()).filter(Boolean);
    return savedList.filter(w => seenWords.includes(w)).length;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "24px 16px",
      maxWidth: 700,
      margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
        <Link href="/" style={{
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          width:36, height:36, borderRadius:10,
          background:"var(--surface)", border:"1px solid var(--border)",
          color:"var(--text)", textDecoration:"none", fontSize:18,
        }}>←</Link>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, margin:0 }}>📝 My Word List</h1>
          <p style={{ fontSize:13, color:"var(--muted)", margin:0 }}>Add your own words — AI will explain each one</p>
        </div>
      </div>

      {/* Stats */}
      {savedList.length > 0 && (
        <div style={{
          display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:24,
        }}>
          {[
            { label:"Total Words", value: savedList.length, color:"var(--accent)" },
            { label:"Studied",     value: studiedCount(),   color:"#06d6a0" },
            { label:"Remaining",   value: savedList.length - studiedCount(), color:"#f7c59f" },
          ].map(s => (
            <div key={s.label} style={{
              background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:12, padding:"14px 16px", textAlign:"center",
            }}>
              <p style={{ fontSize:26, fontWeight:700, color:s.color, margin:0 }}>{s.value}</p>
              <p style={{ fontSize:12, color:"var(--muted)", margin:0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add words box */}
      <div style={{
        background:"var(--surface)", border:"1px solid var(--border)",
        borderRadius:16, padding:"20px", marginBottom:20,
      }}>
        <p style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>Add New Words</p>
        <p style={{ fontSize:12, color:"var(--muted)", marginBottom:12 }}>
          Paste words separated by commas. Example: <em>ephemeral, candid, serene, lucid, resilient</em>
        </p>
        <textarea
          value={inputText}
          onChange={e => { setInputText(e.target.value); setPreviewWords([]); }}
          placeholder="ephemeral, candid, serene, lucid, resilient, eloquent, tenacious..."
          style={{
            width:"100%", minHeight:120, padding:"12px",
            background:"var(--card)", border:"1px solid var(--border)",
            borderRadius:10, color:"var(--text)", fontSize:14,
            fontFamily:"'DM Sans',sans-serif", resize:"vertical",
            boxSizing:"border-box", outline:"none",
          }}
        />

        {/* Preview */}
        {previewWords.length > 0 && (
          <div style={{ marginTop:12, marginBottom:12 }}>
            <p style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>
              Preview — {previewWords.length} words detected:
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {previewWords.map(w => (
                <span key={w} style={{
                  background:"var(--accent)22", color:"var(--accent)",
                  border:"1px solid var(--accent)44", borderRadius:20,
                  padding:"3px 12px", fontSize:13,
                }}>{w}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:10, marginTop:12 }}>
          <button onClick={handlePreview} style={{
            padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:14,
            background:"var(--card)", border:"1px solid var(--border)",
            color:"var(--text)", fontFamily:"'DM Sans',sans-serif",
          }}>👁 Preview</button>
          <button onClick={handleSave} style={{
            padding:"10px 24px", borderRadius:10, cursor:"pointer", fontSize:14,
            background:"var(--accent)", border:"none",
            color:"white", fontWeight:600, fontFamily:"'DM Sans',sans-serif",
          }}>✅ Save Words</button>
        </div>

        {message && (
          <p style={{ marginTop:12, fontSize:13, color: message.startsWith("⚠") ? "#ef476f" : "var(--accent)" }}>
            {message}
          </p>
        )}
      </div>

      {/* Saved word list */}
      {savedList.length > 0 && (
        <div style={{
          background:"var(--surface)", border:"1px solid var(--border)",
          borderRadius:16, padding:"20px",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ fontSize:14, fontWeight:600, margin:0 }}>Your Words ({savedList.length})</p>
            <button onClick={handleClearAll} style={{
              padding:"6px 14px", borderRadius:8, cursor:"pointer", fontSize:12,
              background:"#ef476f22", border:"1px solid #ef476f44",
              color:"#ef476f", fontFamily:"'DM Sans',sans-serif",
            }}>🗑 Clear All</button>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {savedList.map(word => {
              const history  = JSON.parse(localStorage.getItem("vocab_history") || "[]");
              const seenSet  = new Set(history.map(w => w.word?.toLowerCase()).filter(Boolean));
              const isStudied = seenSet.has(word.toLowerCase());
              return (
                <div key={word} style={{
                  display:"flex", alignItems:"center", gap:6,
                  background: isStudied ? "#06d6a022" : "var(--card)",
                  border:`1px solid ${isStudied ? "#06d6a044" : "var(--border)"}`,
                  borderRadius:20, padding:"4px 12px 4px 14px",
                }}>
                  <span style={{
                    fontSize:13,
                    color: isStudied ? "#06d6a0" : "var(--text)",
                  }}>
                    {isStudied ? "✓ " : ""}{word}
                  </span>
                  <button onClick={() => handleRemoveWord(word)} style={{
                    background:"none", border:"none", cursor:"pointer",
                    color:"var(--muted)", fontSize:14, padding:"0 2px", lineHeight:1,
                  }}>×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {savedList.length === 0 && (
        <div style={{
          textAlign:"center", padding:"40px 20px",
          color:"var(--muted)", fontSize:14,
        }}>
          <p style={{ fontSize:40, marginBottom:12 }}>📭</p>
          <p>No words yet. Paste some words above and click Save!</p>
        </div>
      )}
    </div>
  );
}