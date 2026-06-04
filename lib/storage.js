// lib/storage.js
// This file handles saving and loading words from the browser's localStorage

export function saveWord(wordData) {
  if (typeof window === "undefined") return;
  const existing = getHistory();
  // Avoid duplicates
  const filtered = existing.filter(
    (w) => w.word?.toLowerCase() !== wordData.word?.toLowerCase()
  );
  const updated = [{ ...wordData, seenAt: new Date().toISOString() }, ...filtered];
  localStorage.setItem("vocab_history", JSON.stringify(updated.slice(0, 200)));
}

export function getHistory() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("vocab_history") || "[]");
  } catch {
    return [];
  }
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("vocab_history");
}