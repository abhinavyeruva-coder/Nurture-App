import type { ReactNode } from "react"

/**
 * Single mobile-width app shell. The ambient blobs are absolutely positioned
 * inside this container (not viewport-fixed), so they never bleed past the
 * 420px frame and read as a second layer on wide screens.
 */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center bg-[oklch(0.93_0.018_95)]">
      <div className="relative isolate w-full max-w-[420px] overflow-hidden bg-background shadow-[0_0_60px_-15px_oklch(0.3_0.05_150/0.25)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[var(--sprout)]/10 blur-3xl" />
          <div className="absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>
        <div className="relative pt-[max(env(safe-area-inset-top),24px)]">{children}</div>
      </div>
    </div>
  )
}
