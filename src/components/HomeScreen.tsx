import { Flame, Leaf, Sprout, AlertTriangle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { GrowthVisual, type GrowthStage } from "@/components/GrowthVisual"

export interface HomeScreenProps {
  userName?: string
  goalName: string
  streak: number
  longestStreak: number
  vitality: number
  stage: GrowthStage
  isWilting: boolean
  inGracePeriod: boolean
  checkedInToday: boolean
  onCheckIn: () => void
  onViewLog: () => void
}

const STAGE_LABEL: Record<GrowthStage, string> = {
  seed: "Seed",
  sprout: "Sprout",
  sapling: "Sapling",
  budding: "Budding",
  flourishing: "Flourishing",
}

export function HomeScreen({
  userName = "Avery",
  goalName,
  streak,
  longestStreak,
  vitality,
  stage,
  isWilting,
  inGracePeriod,
  checkedInToday,
  onCheckIn,
  onViewLog,
}: HomeScreenProps) {
  return (
    <div className="flex min-h-screen w-full flex-col px-5 pb-10 pt-7">
        {/* header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="font-heading text-2xl font-medium text-foreground">{userName}</h1>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
            <Leaf className="h-5 w-5" />
          </div>
        </header>

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

        {/* growth card */}
        <Card className="mt-6 overflow-hidden border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
          <CardContent className="flex flex-col items-center px-6 pb-2 pt-4">
            <div className="flex w-full items-center justify-between">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-[0.7rem] font-medium tracking-wide text-secondary-foreground">
                {goalName}
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-none bg-transparent px-0 text-[0.7rem] font-medium text-muted-foreground"
              >
                {STAGE_LABEL[stage]}
              </Badge>
            </div>

            <div className="h-56 w-56">
              <GrowthVisual stage={stage} wilting={isWilting} className="h-full w-full" />
            </div>

            <div className="mb-1 flex w-full items-center gap-3">
              <Sprout className="h-4 w-4 shrink-0 text-[var(--sprout)]" />
              <Progress value={vitality} className="h-1.5" />
              <span className="w-9 shrink-0 text-right text-xs font-medium text-muted-foreground">
                {vitality}%
              </span>
            </div>
          </CardContent>
        </Card>

        {/* streak stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Card className="border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
            <CardContent className="flex flex-col gap-1 px-4 py-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Flame className="h-4 w-4 text-[var(--accent)]" />
                <span className="text-xs font-medium">Current streak</span>
              </div>
              <p className="font-heading text-2xl font-medium text-foreground">
                {streak} <span className="text-sm font-sans font-normal text-muted-foreground">day{streak === 1 ? "" : "s"}</span>
              </p>
            </CardContent>
          </Card>
          <Card className="border-none bg-card shadow-sm ring-1 ring-foreground/[0.06]">
            <CardContent className="flex flex-col gap-1 px-4 py-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Leaf className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Longest streak</span>
              </div>
              <p className="font-heading text-2xl font-medium text-foreground">
                {longestStreak} <span className="text-sm font-sans font-normal text-muted-foreground">days</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* spacer pushes CTA + log link down on tall screens */}
        <div className="flex-1" />

        <button
          type="button"
          onClick={onViewLog}
          className="mt-6 flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary"
        >
          View growth log & streak history
          <ChevronRight className="h-4 w-4" />
        </button>

        <Button
          size="lg"
          onClick={onCheckIn}
          disabled={checkedInToday}
          className="mt-3 h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-100 disabled:bg-secondary disabled:text-secondary-foreground"
        >
          {checkedInToday ? "Checked in ✓" : "Check in for today"}
        </Button>
    </div>
  )
}
