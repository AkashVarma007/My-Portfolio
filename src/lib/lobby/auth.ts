import type { AuthError } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "./supabase-browser";
import { isValidUsername } from "./sanitizer";
import { containsProfanity } from "./filter";

const EMAIL_DOMAIN = "lobby.akash.local";

export type LobbyProfile = {
  id: string;
  username: string;
  variant: string;
  name_color: string;
  created_at: string;
};

export type AuthResult =
  | { ok: true; profile: LobbyProfile }
  | { ok: false; error: string };

export function usernameToEmail(username: string): string {
  return `${username.toLowerCase()}@${EMAIL_DOMAIN}`;
}

function validateUsername(username: string): string | null {
  if (!isValidUsername(username)) {
    return "Username must be 3-16 chars, letters/numbers/underscore only.";
  }
  if (containsProfanity(username)) {
    return "Please pick a different username.";
  }
  return null;
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be 8+ characters.";
  return null;
}

export async function registerAccount(
  username: string,
  password: string,
  variant = "default"
): Promise<AuthResult> {
  const usernameErr = validateUsername(username);
  if (usernameErr) return { ok: false, error: usernameErr };
  const passErr = validatePassword(password);
  if (passErr) return { ok: false, error: passErr };

  const supabase = getSupabaseBrowser();
  const email = usernameToEmail(username);

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return { ok: false, error: translateAuthError(error) };
  if (!data.user) return { ok: false, error: "Sign-up failed." };

  const { data: profile, error: insertErr } = await supabase
    .from("lobby_profiles")
    .insert({ id: data.user.id, username, variant, name_color: "#ffffff" })
    .select()
    .single();

  if (insertErr || !profile) {
    return { ok: false, error: insertErr?.message ?? "Profile creation failed." };
  }
  return { ok: true, profile: profile as LobbyProfile };
}

export async function loginAccount(
  username: string,
  password: string
): Promise<AuthResult> {
  const usernameErr = validateUsername(username);
  if (usernameErr) return { ok: false, error: usernameErr };

  const supabase = getSupabaseBrowser();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(username),
    password,
  });
  if (error) return { ok: false, error: translateAuthError(error) };
  if (!data.user) return { ok: false, error: "Login failed." };

  const profile = await fetchProfile(data.user.id);
  if (!profile) return { ok: false, error: "Profile not found." };
  return { ok: true, profile };
}

export async function logout(): Promise<void> {
  const supabase = getSupabaseBrowser();
  await supabase.auth.signOut();
}

export async function getCurrentProfile(): Promise<LobbyProfile | null> {
  const supabase = getSupabaseBrowser();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return fetchProfile(data.user.id);
}

async function fetchProfile(userId: string): Promise<LobbyProfile | null> {
  const supabase = getSupabaseBrowser();
  const { data } = await supabase
    .from("lobby_profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return (data as LobbyProfile | null) ?? null;
}

export function translateAuthError(error: AuthError): string {
  const msg = error.message.toLowerCase();
  if (msg.includes("already registered") || msg.includes("user already")) {
    return "Username is taken.";
  }
  if (msg.includes("invalid login")) {
    return "Wrong username or password.";
  }
  return error.message;
}
