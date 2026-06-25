import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { GrowthVisual, type GrowthStage } from "@/components/GrowthVisual"

export interface CheckInAnswers {
  didHabit: boolean
  howItWent: string
  reason: string
}

interface CheckInScreenProps {
  goalName: string
  /** plant's current stage — shown on a "No" reflection (no growth) */
  currentStage: GrowthStage
  /** plant's stage after one more day — shown on a "Yes" check-in */
  grownStage: GrowthStage
  onComplete: (answers: CheckInAnswers) => void
  onExit: () => void
}

type Step = 0 | 1 | 2 | 3

const TOTAL_QUESTIONS = 3

const variants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

interface BranchCopy {
  q2Title: string
  q2Placeholder: string
  q3Title: string
  q3Placeholder: string
  confirmTitle: string
  confirmSub: string
}

const YES_COPY: BranchCopy = {
  q2Title: "Nice. How did it feel?",
  q2Placeholder: "Be real — even a small win counts...",
  q3Title: "What helped you show up today?",
  q3Placeholder: "Even something small. Mood? Time of day? A song?",
  confirmTitle: "Your plant has been watered.",
  confirmSub: "See you tomorrow.",
}

const NO_COPY: BranchCopy = {
  q2Title: "What got in the way?",
  q2Placeholder: "No judgment here. Just be honest...",
  q3Title: "What would make tomorrow different?",
  q3Placeholder: "One small thing. Doesn't have to be big...",
  confirmTitle: "Reflection counts too.",
  confirmSub: "Try again tomorrow.",
}

export function CheckInScreen({ goalName, currentStage, grownStage, onComplete, onExit }: CheckInScreenProps) {
  const [step, setStep] = useState<Step>(0)
  const [didHabit, setDidHabit] = useState<boolean | null>(null)
  const [howItWent, setHowItWent] = useState("")
  const [reason, setReason] = useState("")

  // Branch question + confirmation copy on the first answer. Defaults to YES
  // copy while didHabit is null (step 0), but is never read there.
  const copy = didHabit === false ? NO_COPY : YES_COPY

  const goBack = () => {
    if (step === 0) {
      onExit()
      return
    }
    setStep((s) => (s - 1) as Step)
  }

  const finish = () => {
    const answers: CheckInAnswers = { didHabit: didHabit ?? false, howItWent, reason }
    onComplete(answers)
    setStep(3)
  }

  return (
    <div className="flex min-h-screen w-full flex-col px-5 pb-10 pt-7">
      {step < 3 && (
        <>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Back"
              onClick={goBack}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-1 gap-1.5">
              {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
                <div
                  key={i}
                  className={
                    "h-1.5 flex-1 rounded-full transition-colors " +
                    (i <= step ? "bg-primary" : "bg-muted")
                  }
                />
              ))}
            </div>
            <span className="shrink-0 text-xs font-medium text-muted-foreground">
              {step + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <p className="mt-5 text-center text-sm font-medium tracking-wide text-muted-foreground">
            {goalName}
          </p>
        </>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="q1"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-1 flex-col items-center justify-center gap-10 py-10"
          >
            <h2 className="max-w-xs text-center font-heading text-2xl font-medium text-foreground">
              Did you do your habit today?
            </h2>
            <div className="flex w-full max-w-xs gap-4">
              <button
                type="button"
                onClick={() => {
                  setDidHabit(true)
                  setStep(1)
                }}
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-primary px-4 py-7 text-primary-foreground transition-transform active:scale-[0.97]"
              >
                <Check className="h-6 w-6" />
                <span className="text-sm font-medium">Yes</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDidHabit(false)
                  setStep(1)
                }}
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl bg-secondary px-4 py-7 text-secondary-foreground transition-transform active:scale-[0.97]"
              >
                <X className="h-6 w-6" />
                <span className="text-sm font-medium">No</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="q2"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-1 flex-col justify-center gap-6 py-10"
          >
            <h2 className="text-center font-heading text-2xl font-medium text-foreground">
              {copy.q2Title}
            </h2>
            <Textarea
              autoFocus
              value={howItWent}
              onChange={(e) => setHowItWent(e.target.value.slice(0, 160))}
              placeholder={copy.q2Placeholder}
              className="min-h-28 resize-none rounded-2xl border-none bg-card px-4 py-3 text-base shadow-sm ring-1 ring-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              size="lg"
              disabled={howItWent.trim().length === 0}
              onClick={() => setStep(2)}
              className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="q3"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex flex-1 flex-col justify-center gap-6 py-10"
          >
            <h2 className="text-center font-heading text-2xl font-medium text-foreground">
              {copy.q3Title}
            </h2>
            <Textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 160))}
              placeholder={copy.q3Placeholder}
              className="min-h-28 resize-none rounded-2xl border-none bg-card px-4 py-3 text-base shadow-sm ring-1 ring-foreground/[0.06] focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              size="lg"
              disabled={reason.trim().length === 0}
              onClick={finish}
              className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Finish check-in
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center"
          >
            <div className="h-44 w-44">
              <GrowthVisual
                stage={didHabit ? grownStage : currentStage}
                className="h-full w-full"
              />
            </div>
            <h2 className="max-w-xs font-heading text-2xl font-medium text-foreground">
              {copy.confirmTitle}
            </h2>
            <p className="max-w-xs text-sm text-muted-foreground">
              {copy.confirmSub}
            </p>
            <Button
              size="lg"
              onClick={onExit}
              className="mt-2 h-14 w-full max-w-xs rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Back to Home
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
