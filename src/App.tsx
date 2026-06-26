import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { AppFrame } from "@/components/AppFrame"
import { HomeScreen } from "@/components/HomeScreen"
import { CheckInScreen, type CheckInAnswers } from "@/components/CheckInScreen"
import { GrowthLogScreen } from "@/components/GrowthLogScreen"
import type { GrowthStage } from "@/components/GrowthVisual"
import { MOCK_CHECKINS, TODAY, toDateKey, type CheckInRecord } from "@/lib/checkins"

function stageFromStreak(streak: number): GrowthStage {
  if (streak <= 3) return "seed" // days 1–3
  if (streak <= 7) return "sprout" // days 4–7
  if (streak <= 14) return "sapling" // days 8–14
  if (streak <= 30) return "budding" // days 15–30
  return "flowering" // day 31+
}

type Screen = "home" | "checkin" | "log"

function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [streak, setStreak] = useState(9)
  const [longestStreak, setLongestStreak] = useState(21)
  const [vitality, setVitality] = useState(78)
  // Sample state: a 9-day streak with 6 reflections, so the growth + roots read clearly.
  const [reflections, setReflections] = useState(6)
  const [checkInLog, setCheckInLog] = useState<CheckInRecord[]>(MOCK_CHECKINS)
  const inGracePeriod = false
  const isWilting = false

  const goalName = "Read 20 minutes"

  const handleCompleteCheckIn = (answers: CheckInAnswers) => {
    // Always save the reflection. Only a "Yes" grows the streak + plant;
    // a "No" is logged but leaves the streak untouched (grace handles the miss).
    if (answers.didHabit) {
      const nextStreak = streak + 1
      setStreak(nextStreak)
      setLongestStreak((longest) => Math.max(longest, nextStreak))
      setVitality((v) => Math.min(100, v + 8))
    }
    // Any real reflection — Yes or No — counts toward the plant's vitality.
    if (answers.howItWent.trim() || answers.reason.trim()) {
      setReflections((r) => r + 1)
    }
    setCheckedInToday(true)
    const todayKey = toDateKey(TODAY)
    setCheckInLog((log) => [
      ...log.filter((e) => e.date !== todayKey),
      { ...answers, date: todayKey },
    ])
  }

  return (
    <AppFrame>
      <AnimatePresence mode="wait">
        {screen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <HomeScreen
              userName="Avery"
              goalName={goalName}
              streak={streak}
              longestStreak={longestStreak}
              reflections={reflections}
              vitality={vitality}
              stage={stageFromStreak(streak)}
              isWilting={isWilting}
              inGracePeriod={inGracePeriod}
              checkedInToday={checkedInToday}
              onCheckIn={() => setScreen("checkin")}
              onViewLog={() => setScreen("log")}
            />
          </motion.div>
        )}

        {screen === "log" && (
          <motion.div
            key="log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GrowthLogScreen
              goalName={goalName}
              entries={checkInLog}
              onBack={() => setScreen("home")}
            />
          </motion.div>
        )}

        {screen === "checkin" && (
          <motion.div
            key="checkin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <CheckInScreen
              goalName={goalName}
              currentStage={stageFromStreak(streak)}
              grownStage={stageFromStreak(streak + 1)}
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
