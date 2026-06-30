import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Pot, PlantBody } from "@/components/PlantArt"
import type { GrowthStage } from "@/components/GrowthVisual"
import type { PlantType } from "@/lib/profile"

const LEAF = "var(--sprout)"
const LEAF_DEEP = "oklch(0.45 0.12 150)"

/**
 * A small, generic sprout — the just-germinated seed shown at Seed stage,
 * before the chosen plant species emerges at Sprout stage.
 */
function Sprout() {
  return (
    <>
      <path d="M32 51 C32 45 32 42 32 39" stroke={LEAF} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M32 45 C27 45 24 41 25 37 C30 38 32 42 32 45 Z" fill={LEAF} />
      <path d="M32 45 C37 45 40 41 39 37 C34 38 32 42 32 45 Z" fill={LEAF_DEEP} />
    </>
  )
}

interface PlantVisualProps {
  /** which plant the user chose during onboarding */
  type: PlantType
  /** current growth stage — drives whether the chosen species is shown yet */
  stage: GrowthStage
  /** when true, the plant grows out of the soil (~1.5s ease-out) on mount */
  animateIn?: boolean
  /** skip the grow animation (prefers-reduced-motion) */
  reducedMotion?: boolean
  className?: string
}

/**
 * The Home plant card. At Seed stage (streak 0–3) it shows the seeded pot with a
 * small generic sprout — the chosen species ({@link PlantBody}) doesn't appear
 * until Sprout stage (day 4+), so a "Day 1" user never sees a full-grown plant.
 * `animateIn` grows whatever is on top out of the soil for the onboarding reveal.
 */
export function PlantVisual({ type, stage, animateIn = false, reducedMotion = false, className }: PlantVisualProps) {
  const grow = animateIn && !reducedMotion
  const isSeed = stage === "seed"
  const content = isSeed ? <Sprout /> : <PlantBody type={type} />

  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <svg viewBox="0 0 64 66" className="h-full w-full" role="img" aria-label={isSeed ? "Your seedling" : `Your ${type}`}>
        {/* seeded soil mound in the pot — a sign that something is planted */}
        <path d="M21 51 Q32 41 43 51 Z" fill="oklch(0.44 0.055 61)" />
        <path d="M25 51 Q32 46 39 51 Z" fill="oklch(0.37 0.05 58)" />

        {grow ? (
          <motion.g
            style={{ transformOrigin: "32px 51px" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.15 }}
          >
            {content}
          </motion.g>
        ) : (
          <g>{content}</g>
        )}

        <Pot />
      </svg>
    </div>
  )
}
