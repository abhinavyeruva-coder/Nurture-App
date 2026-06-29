/**
 * Shared check-in data model + mock history for the Growth Log.
 *
 * A check-in is stored against a calendar day (local time, `YYYY-MM-DD`) so the
 * calendar can match entries to cells without timezone drift.
 */
export interface CheckInRecord {
  /** local calendar day, format `YYYY-MM-DD` */
  date: string
  didHabit: boolean
  /** answer to Q2 ("How did it feel?" / "What got in the way?") */
  howItWent: string
  /** answer to Q3 ("What helped?" / "What would make tomorrow different?") */
  reason: string
}

/**
 * The app's notion of "today". Now that real persistence drives the app, this
 * is the actual current date — used for the calendar's today-ring and to key
 * freshly logged check-ins. (`MOCK_CHECKINS` below is retained only for demos.)
 */
export const TODAY = new Date()

/** Local-time `YYYY-MM-DD` key for a Date. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

/** Parse a `YYYY-MM-DD` key into a local-noon Date (avoids TZ off-by-one). */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d, 12)
}

const yes = (date: string, howItWent: string, reason: string): CheckInRecord => ({
  date,
  didHabit: true,
  howItWent,
  reason,
})

const no = (date: string, howItWent: string, reason: string): CheckInRecord => ({
  date,
  didHabit: false,
  howItWent,
  reason,
})

/**
 * Seeded history for "Read 20 minutes". June 2026 reads as a lived-in month:
 * a 9-day streak into today (the 17th–25th), a couple of honest "No" days, and
 * a natural gap on the 7th. A few late-May entries make month navigation feel
 * rewarding.
 */
export const MOCK_CHECKINS: CheckInRecord[] = [
  // —— late May (visible when navigating back a month) ——
  no("2026-05-29", "Long day, never opened the book.", "Keep it on my nightstand, not the shelf."),
  yes("2026-05-30", "Eased back in with a few pages.", "Kept the goal tiny — just start."),
  yes("2026-05-31", "Finished the month on a good note.", "Read with my morning coffee."),

  // —— June ——
  yes("2026-06-01", "Good first day of the month.", "Set my intention for June."),
  yes("2026-06-02", "Solid start, felt motivated.", "Fresh page, fresh energy."),
  yes("2026-06-03", "Steady as usual.", "Stuck to my evening routine."),
  yes("2026-06-04", "Really getting into the plot.", "The house was quiet in the morning."),
  yes("2026-06-05", "Felt easy today.", "Good light and a comfy spot."),
  no("2026-06-06", "Out with friends, skipped it — no regrets.", "Just five minutes when I get home."),
  // 7th — intentional gap (no check-in logged)
  yes("2026-06-08", "Decent focus tonight.", "Read right after dinner."),
  yes("2026-06-09", "Got absorbed quickly.", "Left my phone in another room."),
  yes("2026-06-10", "Nice and relaxed.", "Tea, and no notifications."),
  yes("2026-06-11", "Settled right in.", "Quiet half hour before work."),
  yes("2026-06-12", "Quick session, still proud.", "One-page goal got me started."),
  yes("2026-06-13", "Enjoyed it more than expected.", "Switched to a lighter book."),
  yes("2026-06-14", "Comfortable and steady.", "The evening routine is clicking."),
  no("2026-06-15", "Couldn't focus — ended up scrolling.", "Keep my phone out of reach."),
  no("2026-06-16", "Work ran late and I crashed early.", "Lay the book on my pillow tonight."),
  yes("2026-06-17", "Good momentum building back up.", "Same chair, same time as before."),
  yes("2026-06-18", "Short and sweet today.", "Read on the train instead of scrolling."),
  yes("2026-06-19", "Focused and present.", "Closed every other tab first."),
  yes("2026-06-20", "Felt good to get back to a story.", "Picked something fun, not a chore."),
  yes("2026-06-21", "Just ten minutes, but I showed up.", "Lowered the bar and it still counted."),
  yes("2026-06-22", "Really hooked on this book now.", "Morning light and a quiet house."),
  yes("2026-06-23", "Slow start, but I got into it.", "A cup of tea helped me settle."),
  yes("2026-06-24", "Read a chapter before bed — calm and easy.", "Made it the last thing I did tonight."),
  yes("2026-06-25", "Locked in for the full twenty — barely noticed the time.", "Left my phone charging in the kitchen."),
]
