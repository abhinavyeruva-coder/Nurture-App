import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  type CheckInRecord,
  TODAY,
  toDateKey,
  fromDateKey,
} from "@/lib/checkins"

interface GrowthLogScreenProps {
  goalName: string
  entries: CheckInRecord[]
  onBack: () => void
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"]

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const TODAY_KEY = toDateKey(TODAY)

function formatLongDate(key: string): string {
  return fromDateKey(key).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
}

export function GrowthLogScreen({ goalName, entries, onBack }: GrowthLogScreenProps) {
  // First day of the month currently in view; starts on the month containing today.
  const [viewMonth, setViewMonth] = useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1))
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const byDate = useMemo(() => {
    const map = new Map<string, CheckInRecord>()
    for (const e of entries) map.set(e.date, e)
    return map
  }, [entries])

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = new Date(year, month, 1).getDay() // 0 = Sunday

  // Monthly tally for the summary line under the header.
  const { showedUp, reflected } = useMemo(() => {
    let s = 0
    let r = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const rec = byDate.get(toDateKey(new Date(year, month, d)))
      if (!rec) continue
      if (rec.didHabit) s++
      else r++
    }
    return { showedUp: s, reflected: r }
  }, [byDate, year, month, daysInMonth])

  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selected = selectedKey ? byDate.get(selectedKey) : undefined

  return (
    <div className="relative flex min-h-screen w-full flex-col px-5 pb-10 pt-[max(env(safe-area-inset-top),28px)]">
      {/* header */}
      <header className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-heading text-2xl font-medium text-foreground">Your Growth</h1>
          <p className="text-sm text-muted-foreground">{goalName}</p>
        </div>
      </header>

      {/* month nav */}
      <div className="mt-7 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setViewMonth(new Date(year, month - 1, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="font-heading text-lg font-medium text-foreground">
            {MONTH_NAMES[month]} {year}
          </p>
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setViewMonth(new Date(year, month + 1, 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-secondary"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* calendar */}
      <div className="mt-5 rounded-3xl bg-card p-4 shadow-sm ring-1 ring-foreground/[0.06]">
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className="pb-1 text-center text-[0.7rem] font-medium uppercase tracking-wide text-muted-foreground/70"
            >
              {d}
            </div>
          ))}

          {cells.map((day, i) => {
            if (day === null) return <div key={`b${i}`} aria-hidden />

            const key = toDateKey(new Date(year, month, day))
            const rec = byDate.get(key)
            const isToday = key === TODAY_KEY

            const base =
              "relative flex aspect-square items-center justify-center rounded-xl text-sm transition-colors"
            const ring = isToday ? " ring-2 ring-primary/45" : ""

            if (!rec) {
              // Empty day — neutral, not tappable.
              return (
                <div
                  key={key}
                  className={base + ring + " text-foreground/35"}
                >
                  {day}
                </div>
              )
            }

            const tone = rec.didHabit
              ? "bg-[oklch(0.62_0.13_142/0.20)] text-[oklch(0.30_0.06_150)] font-medium hover:bg-[oklch(0.62_0.13_142/0.28)]"
              : "bg-[oklch(0.60_0.12_45/0.16)] text-[oklch(0.46_0.11_45)] font-medium hover:bg-[oklch(0.60_0.12_45/0.24)]"

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                aria-label={`${formatLongDate(key)} — ${rec.didHabit ? "showed up" : "reflected"}`}
                className={base + ring + " " + tone + " active:scale-[0.94]"}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* legend */}
      <div className="mt-5 flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--sprout)]" />
          Showed up
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--clay)]" />
          Reflected
        </span>
      </div>

      {/* monthly summary */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        This month you showed up{" "}
        <span className="font-medium text-foreground">{showedUp} day{showedUp === 1 ? "" : "s"}</span>
        {reflected > 0 && (
          <>
            {" "}and reflected on{" "}
            <span className="font-medium text-foreground">{reflected} day{reflected === 1 ? "" : "s"}</span>
          </>
        )}
        .
      </p>

      {/* day detail bottom sheet */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute inset-0 z-20 flex flex-col justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelectedKey(null)}
              className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            />
            <motion.div
              key={selectedKey}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative z-10 rounded-t-[2rem] bg-card px-6 pb-9 pt-5 shadow-[0_-12px_40px_-12px_oklch(0.3_0.05_150/0.3)]"
            >
              <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-foreground/10" />

              <div className="flex items-center justify-between">
                <p className="font-heading text-xl font-medium text-foreground">
                  {formatLongDate(selectedKey!)}
                </p>
                <span
                  className={
                    "shrink-0 rounded-full px-3 py-1 text-xs font-medium " +
                    (selected.didHabit
                      ? "bg-[oklch(0.62_0.13_142/0.18)] text-[oklch(0.30_0.06_150)]"
                      : "bg-[oklch(0.60_0.12_45/0.16)] text-[oklch(0.46_0.11_45)]")
                  }
                >
                  {selected.didHabit ? "Showed up" : "Reflected"}
                </span>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                    {selected.didHabit ? "How did it feel?" : "What got in the way?"}
                  </p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-foreground/90">
                    {selected.howItWent}
                  </p>
                </div>
                <div className="h-px bg-border" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                    {selected.didHabit
                      ? "What helped you show up?"
                      : "What would make tomorrow different?"}
                  </p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-foreground/90">
                    {selected.reason}
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                onClick={() => setSelectedKey(null)}
                className="mt-8 h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Back to log
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
