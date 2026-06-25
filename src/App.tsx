import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { AppFrame } from "@/components/AppFrame"
import { HomeScreen } from "@/components/HomeScreen"
import { CheckInScreen, type CheckInAnswers } from "@/components/CheckInScreen"
import { GrowthLogScreen } from "@/components/GrowthLogScreen"
import type { GrowthStage } from "@/components/GrowthVisual"
import { MOCK_CHECKINS, TODAY, toDateKey, type CheckInRecord } from "@/lib/checkins"

function stageFromStreak(streak: number): GrowthStage {
  if (streak <= 0) return "seed"
  if (streak <= 2) return "sprout"
  if (streak <= 6) return "sapling"
  if (streak <= 13) return "budding"
  return "flourishing"
}

type Screen = "home" | "checkin" | "log"

function App() {
  const [screen, setScreen] = useState<Screen>("home")
  const [checkedInToday, setCheckedInToday] = useState(false)
  const [streak, setStreak] = useState(9)
  const [longestStreak, setLongestStreak] = useState(21)
  const [vitality, setVitality] = useState(78)
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
