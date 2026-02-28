// Local storage helpers for ContentFlow AI (no auth needed)

export type ContentGeneration = {
  id: string;
  idea: string;
  platforms: string[];
  generated_content: Record<string, { text: string; hashtags?: string[]; wordCount: number; tone: string }>;
  tone: string;
  created_at: string;
};

export type UserProfile = {
  display_name: string;
  brand_voice: string;
  target_audience: string;
  preferred_platforms: string[];
  tone_preference: string;
  industry: string;
};

const PROFILE_KEY = "contentflow_profile";
const HISTORY_KEY = "contentflow_history";

const defaultProfile: UserProfile = {
  display_name: "Creator",
  brand_voice: "professional",
  target_audience: "",
  preferred_platforms: ["twitter", "linkedin"],
  tone_preference: "informational",
  industry: "",
};

export function getProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getHistory(): ContentGeneration[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addToHistory(item: Omit<ContentGeneration, "id" | "created_at">) {
  const history = getHistory();
  const newItem: ContentGeneration = {
    ...item,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  history.unshift(newItem);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  return newItem;
}

export function deleteFromHistory(id: string) {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
