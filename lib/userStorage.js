// lib/userStorage.js
// Handles saving/loading user progress from Supabase
// Falls back to localStorage when user is not logged in

import { supabase } from "./supabase";

// ── Save a word (to Supabase if logged in, localStorage if not) ──
export async function saveWord(wordData, category = "everyday") {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Save to Supabase
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      word: wordData.word?.toLowerCase(),
      word_data: wordData,
      seen_at: new Date().toISOString(),
      category,
    }, { onConflict: "user_id,word" });
  }

  // Always save to localStorage as cache
  const existing = getLocalHistory();
  const filtered = existing.filter(w => w.word?.toLowerCase() !== wordData.word?.toLowerCase());
  const updated  = [{ ...wordData, seenAt: new Date().toISOString() }, ...filtered];
  localStorage.setItem("vocab_history", JSON.stringify(updated.slice(0, 500)));
}

// ── Get history (from Supabase if logged in, localStorage if not) ──
export async function getHistory() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("user_progress")
      .select("word_data, seen_at, category")
      .eq("user_id", user.id)
      .order("seen_at", { ascending: false });

    return (data || []).map(row => ({
      ...row.word_data,
      seenAt: row.seen_at,
      category: row.category,
    }));
  }

  return getLocalHistory();
}

// ── Get seen word strings (fast, for dedup) ──
export async function getSeenWords() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("user_progress")
      .select("word")
      .eq("user_id", user.id);
    return (data || []).map(r => r.word.toLowerCase());
  }

  return getLocalHistory().map(w => w.word?.toLowerCase()).filter(Boolean);
}

// ── Save/load custom word list ──
export async function saveCustomList(words) {
  const { data: { user } } = await supabase.auth.getUser();
  localStorage.setItem("custom_word_list", JSON.stringify(words));

  if (user) {
    await supabase.from("custom_word_lists").upsert({
      user_id: user.id,
      words,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  }
}

export async function loadCustomList() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("custom_word_lists")
      .select("words")
      .eq("user_id", user.id)
      .single();
    if (data?.words) {
      localStorage.setItem("custom_word_list", JSON.stringify(data.words));
      return data.words;
    }
  }

  return JSON.parse(localStorage.getItem("custom_word_list") || "[]");
}

// ── Save/load category preference ──
export async function saveCategory(category) {
  const { data: { user } } = await supabase.auth.getUser();
  localStorage.setItem("word_category", category);

  if (user) {
    await supabase.from("user_settings").upsert({
      user_id: user.id,
      current_category: category,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
  }
}

export async function loadCategory() {
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data } = await supabase
      .from("user_settings")
      .select("current_category")
      .eq("user_id", user.id)
      .single();
    if (data?.current_category) return data.current_category;
  }

  return localStorage.getItem("word_category") || "everyday";
}

// ── Sync localStorage → Supabase after login ──
export async function syncLocalToSupabase() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const localHistory = getLocalHistory();
  if (localHistory.length === 0) return;

  const rows = localHistory.map(w => ({
    user_id: user.id,
    word: w.word?.toLowerCase(),
    word_data: w,
    seen_at: w.seenAt || new Date().toISOString(),
  }));

  await supabase.from("user_progress").upsert(rows, { onConflict: "user_id,word" });
}

// ── Clear history ──
export async function clearHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  localStorage.removeItem("vocab_history");

  if (user) {
    await supabase.from("user_progress").delete().eq("user_id", user.id);
  }
}

// ── localStorage helpers ──
export function getLocalHistory() {
  try {
    return JSON.parse(localStorage.getItem("vocab_history") || "[]");
  } catch { return []; }
}