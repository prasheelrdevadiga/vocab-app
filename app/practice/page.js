// app/practice/page.js
"use client";
import { useState, useEffect } from "react";
import { getHistory } from "@/lib/storage";

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function buildQuiz(history) {
  if (history.length < 2) return null;
  const shuffled = shuffle(history);
  const correct  = shuffled[0];
  const wrongs   = shuffle(shuffled.slice(1)).slice(0, 3);
  const options  = shuffle([correct, ...wrongs]);
  const type     = Math.random() > 0.5 ? "meaning" : "word";
  return { correct, options, type };
}

export default function PracticePage() {
  const [history, setHistory]   = useState([]);
  const [quiz, setQuiz]         = useState(null);
  const [chosen, setChosen]     = useState(null);
  const [score, setScore]       = useState({ right:0, wrong:0 });
  const [streak, setStreak]     = useState(0);
  const [showExp, setShowExp]   = useState(false);

  useEffect(() => {
    const h = getHistory();
    setHistory(h);
    if (h.length >= 2) setQuiz(buildQuiz(h));
  }, []);

  const handleAnswer = (w) => {
    if (chosen) return;
    setChosen(w);
    const correct = w.word === quiz.correct.word;
    setScore(s => ({ right: s.right + (correct?1:0), wrong: s.wrong + (correct?0:1) }));
    setStreak(s => correct ? s+1 : 0);
  };

  const next = () => {
    setChosen(null); setShowExp(false);
    setQuiz(buildQuiz(history));
  };

  if (history.length < 4) return (
    <div style={{ textAlign:"center", padding:80, color:"var(--muted)" }}>
      <p style={{ fontSize:48, marginBottom:16 }}>🧠</p>
      <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", marginBottom:12, color:"var(--text)" }}>Not enough words yet!</h2>
      <p>You need at least 4 words in history to practice.</p>
      <p style={{ marginTop:8 }}>Go explore words on the <a href="/" style={{ color:"var(--accent)" }}>Home page</a> first!</p>
    </div>
  );

  if (!quiz) return null;

  const isCorrect = chosen?.word === quiz.correct.word;

  return (
    <div style={{ maxWidth:640, margin:"0 auto" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.8rem", fontWeight:900 }}>🧠 Practice Quiz</h2>
          <p style={{ color:"var(--muted)", fontSize:13 }}>{history.length} words in your library</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:22, fontWeight:700, color:"#06d6a0" }}>{score.right}</p>
              <p style={{ fontSize:11, color:"var(--muted)" }}>CORRECT</p>
            </div>
            <div style={{ textAlign:"center" }}>
              <p style={{ fontSize:22, fontWeight:700, color:"#ef476f" }}>{score.wrong}</p>
              <p style={{ fontSize:11, color:"var(--muted)" }}>WRONG</p>
            </div>
            {streak > 1 && (
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:22, fontWeight:700, color:"#f7c59f" }}>🔥{streak}</p>
                <p style={{ fontSize:11, color:"var(--muted)" }}>STREAK</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Card */}
      <div style={{ background:"var(--card)", borderRadius:20, border:"1px solid var(--border)", padding:"32px 28px", marginBottom:16 }}>
        <p style={{ fontSize:11, letterSpacing:3, color:"var(--muted)", textTransform:"uppercase", marginBottom:10 }}>
          {quiz.type === "meaning" ? "What is the meaning of this word?" : "Which word matches this definition?"}
        </p>

        {quiz.type === "meaning" ? (
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"2.4rem", fontWeight:900, marginBottom:8 }}>
            {quiz.correct.word}
          </h3>
        ) : (
          <p style={{ fontSize:16, lineHeight:1.7, color:"#c8c9d9", marginBottom:8 }}>
            {quiz.correct.meaning}
          </p>
        )}
        <p style={{ color:"var(--muted)", fontSize:13, fontStyle:"italic", marginBottom:28 }}>
          {quiz.correct.partOfSpeech}
        </p>

        {/* Options */}
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {quiz.options.map((opt, i) => {
            const isThis    = chosen?.word === opt.word;
            const isRight   = opt.word === quiz.correct.word;
            let bg = "var(--surface)", border = "var(--border)", color = "var(--text)";
            if (chosen) {
              if (isRight)        { bg="#06d6a022"; border="#06d6a0"; color="#06d6a0"; }
              else if (isThis)    { bg="#ef476f22"; border="#ef476f"; color="#ef476f"; }
            }
            return (
              <button key={i} onClick={() => handleAnswer(opt)} style={{
                padding:"14px 18px", borderRadius:12, border:`1.5px solid ${border}`,
                background:bg, color, cursor: chosen ? "default" : "pointer",
                fontSize:15, textAlign:"left", fontFamily:"'DM Sans',sans-serif",
                transition:"all 0.2s", lineHeight:1.5,
              }}>
                <span style={{ opacity:0.5, marginRight:10 }}>{String.fromCharCode(65+i)}.</span>
                {quiz.type === "meaning" ? opt.meaning?.slice(0,100)+"…" : opt.word}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {chosen && (
        <div style={{ background: isCorrect?"#06d6a011":"#ef476f11", border:`1px solid ${isCorrect?"#06d6a0":"#ef476f"}`, borderRadius:14, padding:"18px 22px", marginBottom:16, animation:"fadeUp 0.3s ease" }}>
          <p style={{ color: isCorrect?"#06d6a0":"#ef476f", fontWeight:700, fontSize:16, marginBottom:6 }}>
            {isCorrect ? "✅ Correct!" : `❌ The answer was: ${quiz.correct.word}`}
          </p>
          <button onClick={() => setShowExp(!showExp)} style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer", fontSize:13, fontFamily:"'DM Sans',sans-serif", padding:0 }}>
            {showExp ? "▲ Hide explanation" : "▼ Show explanation"}
          </button>
          {showExp && (
            <div style={{ marginTop:12 }}>
              <p style={{ lineHeight:1.7, marginBottom:10 }}>{quiz.correct.meaning}</p>
              <p style={{ color:"#c8c9d9", fontSize:14, lineHeight:1.7 }}>{quiz.correct.explanation}</p>
              {quiz.correct.examples?.slice(0,2).map((ex,i) => (
                <p key={i} style={{ color:"var(--muted)", fontSize:13, marginTop:8, fontStyle:"italic" }}>"{ex}"</p>
              ))}
            </div>
          )}
        </div>
      )}

      {chosen && (
        <div style={{ textAlign:"center" }}>
          <button onClick={next} style={{
            padding:"14px 44px", borderRadius:50, border:"none",
            background:"linear-gradient(135deg,var(--accent),#ff8c5a)",
            color:"#0f0e17", fontSize:16, fontWeight:700,
            fontFamily:"'DM Sans',sans-serif", cursor:"pointer",
            boxShadow:"0 8px 28px #ff6b3544",
          }}>
            Next Question →
          </button>
        </div>
      )}
    </div>
  );
}