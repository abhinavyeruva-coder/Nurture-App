import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlantArt } from "@/components/PlantArt"
import { createProfile, type PlantType, type UserProfile } from "@/lib/profile"

interface OnboardingFlowProps {
  onComplete: (profile: UserProfile) => void
}

// Steps 0..6 → screens 1..7. The progress dots only count screens 2–6 (steps 1–5).
const LAST_STEP = 6
const screenRoot =
  "flex min-h-screen w-full flex-col px-5 pb-10 pt-[max(env(safe-area-inset-top),28px)]"

const slide = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}
const transition = { duration: 0.28, ease: "easeOut" } as const

const WHEN_OPTIONS = ["Morning", "Afternoon", "Evening", "Anytime"]
const PLANT_OPTIONS: { id: PlantType; name: string }[] = [
  { id: "succulent", name: "Succulent" },
  { id: "flower", name: "Flower" },
  { id: "herb", name: "Herb" },
  { id: "sapling", name: "Sapling" },
]

const inputBase =
  "w-full rounded-2xl border-none bg-card px-4 text-base shadow-sm ring-1 ring-foreground/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState("")
  const [habit, setHabit] = useState("")
  const [why, setWhy] = useState("")
  const [when, setWhen] = useState("")
  const [plant, setPlant] = useState<PlantType | "">("")

  const next = () => setStep((s) => Math.min(LAST_STEP, s + 1))
  const back = () => setStep((s) => Math.max(0, s - 1))

  // Per-step validity for the Next button (steps 1–5 take input).
  const stepValid: Record<number, boolean> = {
    1: name.trim().length >= 1,
    2: habit.trim().length >= 3,
    3: why.trim().length >= 5,
    4: when !== "",
    5: plant !== "",
  }

  const finish = () => {
    if (plant === "") return
    onComplete(createProfile({ name, habit, whyItMatters: why, when, plant }))
  }

  const showHeader = step >= 1
  const showDots = step >= 1 && step <= 5

  return (
    <div className={screenRoot}>
      {showHeader && (
        <div className="flex h-10 items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={back}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          {showDots && (
            <div className="flex flex-1 items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((d) => (
                <span
                  key={d}
                  className={
                    "h-1.5 rounded-full transition-all " +
                    (d === step ? "w-5 bg-primary" : d < step ? "w-1.5 bg-primary" : "w-1.5 bg-muted")
                  }
                />
              ))}
            </div>
          )}
          {/* right spacer to keep dots centered */}
          {showDots && <span className="h-10 w-10 shrink-0" />}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Screen 1 — Welcome */}
        {step === 0 && (
          <motion.div
            key="welcome"
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="flex flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <SeedIcon className="h-24 w-24" />
              <div className="space-y-2">
                <h1 className="font-heading text-3xl font-medium text-foreground">Welcome to Nurture.</h1>
                <p className="text-base text-muted-foreground">Let's plant your first seed.</p>
              </div>
            </div>
            <Button size="lg" onClick={next} className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90">
              Get started
            </Button>
          </motion.div>
        )}

        {/* Screen 2 — Name */}
        {step === 1 && (
          <motion.div key="name" variants={slide} initial="enter" animate="center" exit="exit" transition={transition} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-6">
              <h2 className="text-center font-heading text-2xl font-medium text-foreground">What should we call you?</h2>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 40))}
                placeholder="Whatever you go by..."
                autoCapitalize="words"
                onKeyDown={(e) => e.key === "Enter" && stepValid[1] && next()}
                className={inputBase + " h-14 capitalize"}
              />
            </div>
            <Button size="lg" disabled={!stepValid[1]} onClick={next} className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          </motion.div>
        )}

        {/* Screen 3 — Habit */}
        {step === 2 && (
          <motion.div key="habit" variants={slide} initial="enter" animate="center" exit="exit" transition={transition} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-5">
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-2xl font-medium text-foreground">What's the one habit you want to grow?</h2>
                <p className="text-sm text-muted-foreground">One thing at a time. Make it specific.</p>
              </div>
              <Textarea
                autoFocus
                value={habit}
                onChange={(e) => setHabit(e.target.value.slice(0, 120))}
                placeholder="Be specific. One thing only."
                className={inputBase + " min-h-20 resize-none py-3"}
              />
            </div>
            <Button size="lg" disabled={!stepValid[2]} onClick={next} className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          </motion.div>
        )}

        {/* Screen 4 — Why it matters */}
        {step === 3 && (
          <motion.div key="why" variants={slide} initial="enter" animate="center" exit="exit" transition={transition} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-5">
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-2xl font-medium text-foreground">Why does this matter to you right now?</h2>
                <p className="text-sm text-muted-foreground">Be honest. This is just for you.</p>
              </div>
              <Textarea
                autoFocus
                value={why}
                onChange={(e) => setWhy(e.target.value.slice(0, 240))}
                placeholder="No one's reading this but you."
                className={inputBase + " min-h-28 resize-none py-3"}
              />
            </div>
            <Button size="lg" disabled={!stepValid[3]} onClick={next} className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          </motion.div>
        )}

        {/* Screen 5 — When */}
        {step === 4 && (
          <motion.div key="when" variants={slide} initial="enter" animate="center" exit="exit" transition={transition} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-6">
              <h2 className="text-center font-heading text-2xl font-medium text-foreground">When will you do it?</h2>
              <div className="grid grid-cols-2 gap-3">
                {WHEN_OPTIONS.map((opt) => {
                  const selected = when === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setWhen(opt)}
                      className={
                        "rounded-2xl py-5 text-base font-medium transition-colors " +
                        (selected
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/60 text-secondary-foreground hover:bg-secondary")
                      }
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
            <Button size="lg" disabled={!stepValid[4]} onClick={next} className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90">
              Next
            </Button>
          </motion.div>
        )}

        {/* Screen 6 — Plant */}
        {step === 5 && (
          <motion.div key="plant" variants={slide} initial="enter" animate="center" exit="exit" transition={transition} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-6">
              <div className="space-y-2 text-center">
                <h2 className="font-heading text-2xl font-medium text-foreground">Choose your plant.</h2>
                <p className="text-sm text-muted-foreground">It'll grow with you.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {PLANT_OPTIONS.map((opt) => {
                  const selected = plant === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPlant(opt.id)}
                      className={
                        "flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-sm transition-transform duration-200 " +
                        (selected
                          ? "scale-[1.03] ring-2 ring-primary"
                          : "ring-1 ring-foreground/[0.06] hover:ring-foreground/15")
                      }
                    >
                      <PlantArt type={opt.id} className="h-20 w-20" />
                      <span className="text-sm font-medium text-foreground">{opt.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <Button size="lg" disabled={!stepValid[5]} onClick={next} className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90">
              Plant my seed
            </Button>
          </motion.div>
        )}

        {/* Screen 7 — The moment */}
        {step === 6 && (
          <motion.div
            key="moment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 flex-col"
          >
            <PlantingMoment name={name.trim()} habit={habit.trim()} onStart={finish} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Welcome-screen seed icon. */
function SeedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} role="img" aria-label="A seed">
      <ellipse cx="48" cy="56" rx="34" ry="10" fill="oklch(0.88 0.02 95)" />
      <path d="M48 30 C36 34, 32 50, 40 62 C44 54, 52 48, 58 44 C56 36, 52 31, 48 30 Z" fill="var(--sprout)" />
      <path d="M48 30 C52 31, 56 36, 58 44 C52 48, 44 54, 40 62 C46 56, 50 44, 48 30 Z" fill="oklch(0.45 0.12 150)" />
    </svg>
  )
}

/**
 * Screen 7: a seed drops into soil, gets covered, and a sprout emerges (~2.4s),
 * then the personalized message + "Start growing" button fade in.
 */
function PlantingMoment({ name, habit, onStart }: { name: string; habit: string; onStart: () => void }) {
  const reduce = useReducedMotion()
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (reduce) {
      setRevealed(true)
      return
    }
    const t = setTimeout(() => setRevealed(true), 2400)
    return () => clearTimeout(t)
  }, [reduce])

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center">
      <svg viewBox="0 0 160 160" className="h-48 w-48" role="img" aria-label="Planting a seed">
        {/* soil */}
        <ellipse cx="80" cy="132" rx="52" ry="13" fill="oklch(0.42 0.05 60)" />
        <ellipse cx="80" cy="128" rx="52" ry="9" fill="oklch(0.47 0.055 62)" />

        {/* seed dropping in */}
        <motion.ellipse
          cx="80"
          cy="120"
          rx="5"
          ry="7"
          fill="oklch(0.45 0.07 70)"
          initial={reduce ? { opacity: 0 } : { y: -92, opacity: 1 }}
          animate={reduce ? { opacity: 0 } : { y: [-92, 0, 0], opacity: [1, 1, 0] }}
          transition={reduce ? { duration: 0 } : { duration: 1.2, times: [0, 0.55, 1], ease: "easeIn" }}
        />

        {/* soil mound covering the seed */}
        <motion.ellipse
          cx="80"
          cy="124"
          rx="15"
          ry="6"
          fill="oklch(0.38 0.05 58)"
          style={{ transformOrigin: "80px 126px" }}
          initial={reduce ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 0.7, duration: 0.4, ease: "easeOut" }}
        />

        {/* sprout emerging */}
        <motion.g
          style={{ transformOrigin: "80px 122px" }}
          initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 1.3, duration: 1.1, ease: "easeOut" }}
        >
          <path d="M80 122 C80 108, 80 100, 80 92" stroke="var(--sprout)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M80 102 C68 102, 61 94, 63 84 C75 86, 80 94, 80 102 Z" fill="var(--sprout)" />
          <path d="M80 102 C92 102, 99 94, 97 84 C85 86, 80 94, 80 102 Z" fill="oklch(0.45 0.12 150)" />
        </motion.g>
      </svg>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex w-full flex-col items-center gap-7"
          >
            <h1 className="max-w-xs font-heading text-2xl font-medium leading-snug text-foreground">
              Your journey to {habit} starts now, {name}.
            </h1>
            <Button
              size="lg"
              onClick={onStart}
              className="h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start growing
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
