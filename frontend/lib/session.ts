import { Lang } from "@mentor/shared";

// TEAMMATE: When integrating Supabase auth, replace the storage mechanism here.
// The UI components only interact with this session module.

export interface UserSession {
  username: string;
  email: string;
  isGuest: boolean;
  selectedLanguage: Lang;
  createdAt: string;
}

const SESSION_STORAGE_KEY = "ai_coding_mentor_session";

const DEFAULT_SESSION: UserSession = {
  username: "GuestCoder",
  email: "",
  isGuest: true,
  selectedLanguage: "python",
  createdAt: new Date().toISOString(),
};

export const sessionStore = {
  getSession(): UserSession | null {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as UserSession;
    } catch {
      return null;
    }
  },

  saveSession(session: Partial<UserSession>): UserSession {
    if (typeof window === "undefined") {
      return { ...DEFAULT_SESSION, ...session };
    }
    const current = this.getSession() || DEFAULT_SESSION;
    const updated: UserSession = {
      ...current,
      ...session,
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to write session to localStorage", e);
    }
    return updated;
  },

  clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  },
};
