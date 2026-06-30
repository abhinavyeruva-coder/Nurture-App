import { useEffect } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Flame, Leaf, Droplet, Sprout, AlertTriangle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { PlantVisual } from "@/components/PlantVisual"
import { type GrowthStage } from "@/components/GrowthVisual"
import type { PlantType } from "@/lib/profile"

export interface HomeScreenProps {
  userName?: string
  goalName: string
  plantType: PlantType
  streak: number
  longestStreak: number
  reflections: number
  stage: GrowthStage
  isWilting: boolean
  inGracePeriod: boolean
  checkedInToday: boolean
  onCheckIn: () => void
  onViewLog: () => void
  /** play the one-time onboarding → home reveal (plant grows, UI staggers in) */
  intro?: boolean
  /** called once the reveal finishes, so it doesn't replay */
  onIntroComplete?: () => void
}

/** Each stage's display name, the streak day it begins, and where the next starts. */
const STAGE_META: Record<GrowthStage, { label: string; start: number; next?: { label: string; at: number } }> = {
  seed: { label: "Seed", start: 1, next: { label: "Sprout", at: 4 } },
  sprout: { label: "Sprout", start: 4, next: { label: "Sapling", at: 8 } },
  sapling: { label: "Sapling", start: 8, next: { label: "Budding", at: 15 } },
  budding: { label: "Budding", start: 15, next: { label: "Flowering", at: 31 } },
  flowering: { label: "Flowering", start: 31 },
}

/** e.g. "Sapling — 6 days until Budding"; just "Flowering" at the final stage. */
function stageLabel(stage: GrowthStage, streak: number): string {
  const meta = STAGE_META[stage]
  if (!meta.next) return meta.label
  const days = Math.max(1, meta.next.at - streak)
  return `${meta.label} — ${days} day${days === 1 ? "" : "s"} until ${meta.next.label}`
}

/** Progress (0–100) through the current stage toward the next, by streak. */
function stageProgress(stage: GrowthStage, streak: number): number {
  const meta = STAGE_META[stage]
  if (!meta.next) return 100
  const pct = ((streak - meta.start) / (meta.next.at - meta.start)) * 100
  return Math.round(Math.min(100, Math.max(0, pct)))
}

export function HomeScreen({
  userName = "Avery",
  goalName,
  plantType,
  streak,
  longestStreak,
  reflections,
  stage,
  isWilting,
  inGracePeriod,
  checkedInToday,
  onCheckIn,
  onViewLog,
  intro = false,
  onIntroComplete,
}: HomeScreenProps) {
  // Brand-new users (streak 0) get a welcoming "Day 1" label + empty bar;
  // once they've checked in once, the normal stage logic takes over.
  const isNewUser = streak === 0
  const cardLabel = isNewUser ? "Seed — Day 1 of your journey" : stageLabel(stage, streak)
  const progress = isNewUser ? 0 : stageProgress(stage, streak)

  const reduce = useReducedMotion() ?? false
  const revealing = intro && !reduce

  // End the one-time reveal after it plays (or immediately when reduced).
  useEffect(() => {
    if (!intro) return
    const t = setTimeout(() => onIntroComplete?.(), reduce ? 250 : 2600)
    return () => clearTimeout(t)
  }, [intro, reduce, onIntroComplete])

  // Staggered fade/rise for each section during the reveal; a no-op otherwise.
  const reveal = (delay: number) =>
    revealing
      ? {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: "easeOut" as const },
        }
      : {}

  return (
    <div className="flex min-h-screen w-full flex-col px-5 pb-10 pt-[max(env(safe-area-inset-top),28px)]">
        {/* header */}
        <motion.header className="flex items-center justify-between" {...reveal(0.5)}>
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="font-heading text-2xl font-medium text-foreground">{userName}</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
            <Leaf className="h-5 w-5" />
          </div>
        </motion.header>

        {/* grace period / wilting notice */}
        {(inGracePeriod || isWilting) && (
          <div
            className={
              "mt-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm " +
              (isWilting
                ? "bg-[var(--clay)]/12 text-[oklch(0.42_0.1_45)]"
                : "bg-[var(--accent)]/15 text-[oklch(0.4_0.08_60)]")
            }
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              {isWilting
                ? "Your growth has taken some damage. A check-in today will help it recover."
                : "You missed yesterday — today's your grace day. Check in to keep your streak safe."}
            </span>
          </div>
        )}

        {/* growth card — the anchor of the reveal, appears first */}
        <motion.div {...reveal(0.15)}>
        <Card className="mt-6 overflow-hidden border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
          <CardContent className="flex flex-col items-center px-6 pb-2 pt-4">
            <div className="flex w-full items-center justify-between gap-2">
              <Badge variant="secondary" className="min-w-0 max-w-[55%] shrink justify-start rounded-full px-3 py-1 text-[0.7rem] font-medium tracking-wide text-secondary-foreground">
                <span className="truncate">{goalName}</span>
              </Badge>
              <Badge
                variant="outline"
                className="shrink-0 whitespace-nowrap rounded-full border-none bg-transparent px-0 text-[0.7rem] font-medium text-muted-foreground"
              >
                {cardLabel}
              </Badge>
            </div>

            <div className="h-56 w-56">
              <PlantVisual
                type={plantType}
                animateIn={revealing}
                reducedMotion={reduce}
                className="h-full w-full"
              />
            </div>

            <div className="mb-1 flex w-full items-center gap-3">
              <Sprout className="h-4 w-4 shrink-0 text-[var(--sprout)]" />
              <Progress value={progress} className="h-1.5" />
              <span className="w-9 shrink-0 text-right text-xs font-medium text-muted-foreground">
                {progress}%
              </span>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* streak + reflection stats */}
        <motion.div className="mt-4 grid grid-cols-3 gap-3" {...reveal(0.8)}>
          <Card className="border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
            <CardContent className="flex flex-col gap-1 px-3 py-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Flame className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span className="text-[0.7rem] font-medium">Streak</span>
              </div>
              <p className="font-heading text-2xl font-medium text-foreground">
                {streak} <span className="text-xs font-sans font-normal text-muted-foreground">day{streak === 1 ? "" : "s"}</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
            <CardContent className="flex flex-col gap-1 px-3 py-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Droplet className="h-4 w-4 shrink-0 text-[var(--sprout)]" />
                <span className="text-[0.7rem] font-medium">Reflections</span>
              </div>
              <p className="font-heading text-2xl font-medium text-foreground">
                {reflections}
              </p>
            </CardContent>
          </Card>
          <Card className="border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
            <CardContent className="flex flex-col gap-1 px-3 py-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Leaf className="h-4 w-4 shrink-0 text-primary" />
                <span className="text-[0.7rem] font-medium">Longest</span>
              </div>
              <p className="font-heading text-2xl font-medium text-foreground">
                {longestStreak} <span className="text-xs font-sans font-normal text-muted-foreground">days</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* spacer pushes CTA + log link down on tall screens */}
        <div className="flex-1" />

        <motion.button
          type="button"
          onClick={onViewLog}
          className="mt-6 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
          {...reveal(1.1)}
        >
          View growth log & streak history
          <ChevronRight className="h-4 w-4" />
        </motion.button>

        <motion.div {...reveal(1.3)}>
          <Button
            size="lg"
            onClick={onCheckIn}
            disabled={checkedInToday}
            className="mt-3 h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-100 disabled:bg-secondary disabled:text-secondary-foreground"
          >
            {checkedInToday ? "Checked in ✓" : "Check in for today"}
          </Button>
        </motion.div>
    </div>
  )
}
