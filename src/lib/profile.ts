import type { CheckInRecord } from "@/lib/checkins"

export type PlantType = "succulent" | "flower" | "herb" | "sapling"

/** Persisted user profile — the single source of truth, stored in localStorage. */
export interface UserProfile {
  name: string
  habit: string
  whyItMatters: string
  when: string
  plant: PlantType
  onboardedAt: string
  streak: number
  reflections: number
  longestStreak: number
  checkIns: CheckInRecord[]
}

/** The fields collected during onboarding (before defaults are filled in). */
export interface OnboardingData {
  name: string
  habit: string
  whyItMatters: string
  when: string
  plant: PlantType
}

const STORAGE_KEY = "nurture_user"

/** Read the saved profile, or null if there's none / it's malformed. */
export function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as UserProfile
    // Minimal shape check — a valid onboarded user always has a name + habit.
    if (!p || typeof p.name !== "string" || typeof p.habit !== "string") return null
    if (!Array.isArray(p.checkIns)) p.checkIns = []
    return p
  } catch {
    return null
  }
}

/** Persist the profile. Swallows write failures (e.g. private mode / quota). */
export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // ignore — app still works in-memory for the session
  }
}

/** Build a fresh profile from onboarding answers (streak/reflections start at 0). */
export function createProfile(data: OnboardingData): UserProfile {
  return {
    name: data.name.trim(),
    habit: data.habit.trim(),
    whyItMatters: data.whyItMatters.trim(),
    when: data.when,
    plant: data.plant,
    onboardedAt: new Date().toISOString(),
    streak: 0,
    reflections: 0,
    longestStreak: 0,
    checkIns: [],
  }
}
