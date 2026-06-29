import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { AppFrame } from "@/components/AppFrame"
import { HomeScreen } from "@/components/HomeScreen"
import { CheckInScreen, type CheckInAnswers } from "@/components/CheckInScreen"
import { GrowthLogScreen } from "@/components/GrowthLogScreen"
import { OnboardingFlow } from "@/components/OnboardingFlow"
import type { GrowthStage } from "@/components/GrowthVisual"
import { TODAY, toDateKey, type CheckInRecord } from "@/lib/checkins"
import { loadProfile, saveProfile, type UserProfile } from "@/lib/profile"

function stageFromStreak(streak: number): GrowthStage {
  if (streak <= 3) return "seed" // days 1–3
  if (streak <= 7) return "sprout" // days 4–7
  if (streak <= 14) return "sapling" // days 8–14
  if (streak <= 30) return "budding" // days 15–30
  return "flowering" // day 31+
}

type Screen = "home" | "checkin" | "log"

function App() {
  // Single source of truth — loaded from localStorage on first render.
  const [profile, setProfile] = useState<UserProfile | null>(() => loadProfile())
  const [screen, setScreen] = useState<Screen>("home")

  // No saved profile → first run: send the user through onboarding.
  if (!profile) {
    return (
      <AppFrame>
        <OnboardingFlow
          onComplete={(p) => {
            saveProfile(p)
            setProfile(p)
            setScreen("home")
          }}
        />
      </AppFrame>
    )
  }

  const todayKey = toDateKey(TODAY)
  const checkedInToday = profile.checkIns.some((c) => c.date === todayKey)
  const stage = stageFromStreak(profile.streak)

  const handleCompleteCheckIn = (answers: CheckInAnswers) => {
    const wroteReflection = Boolean(answers.howItWent.trim() || answers.reason.trim())
    const record: CheckInRecord = { date: todayKey, ...answers }

    let { streak, longestStreak, reflections } = profile
    if (answers.didHabit) {
      streak = profile.streak + 1
      longestStreak = Math.max(profile.longestStreak, streak)
    }
    if (wroteReflection) reflections = profile.reflections + 1

    const next: UserProfile = {
      ...profile,
      streak,
      longestStreak,
      reflections,
      // one record per day — replace today's if it already exists
      checkIns: [...profile.checkIns.filter((c) => c.date !== todayKey), record],
    }
    saveProfile(next)
    setProfile(next)
  }

  return (
    <AppFrame>
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <HomeScreen
              userName={profile.name}
              goalName={profile.habit}
              streak={profile.streak}
              longestStreak={profile.longestStreak}
              reflections={profile.reflections}
              stage={stage}
              isWilting={false}
              inGracePeriod={false}
              checkedInToday={checkedInToday}
              onCheckIn={() => setScreen("checkin")}
              onViewLog={() => setScreen("log")}
            />
          </motion.div>
        )}

        {screen === "log" && (
          <motion.div key="log" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <GrowthLogScreen goalName={profile.habit} entries={profile.checkIns} onBack={() => setScreen("home")} />
          </motion.div>
        )}

        {screen === "checkin" && (
          <motion.div key="checkin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <CheckInScreen
              goalName={profile.habit}
              currentStage={stage}
              grownStage={stageFromStreak(profile.streak + 1)}
              onComplete={handleCompleteCheckIn}
              onExit={() => setScreen("home")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AppFrame>
  )
}

export default App
