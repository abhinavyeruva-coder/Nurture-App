import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Pot, PlantBody } from "@/components/PlantArt"
import type { PlantType } from "@/lib/profile"

interface PlantVisualProps {
  /** which plant the user chose during onboarding */
  type: PlantType
  /** when true, the plant grows out of the soil (~1.5s ease-out) on mount */
  animateIn?: boolean
  /** skip the grow animation (prefers-reduced-motion) */
  reducedMotion?: boolean
  className?: string
}

/**
 * The user's chosen plant on the Home card. Reuses {@link PlantBody} / {@link Pot}
 * so it matches the onboarding picker exactly. The pot always shows a little soil
 * mound (never empty), and `animateIn` grows the plant out of that soil.
 */
export function PlantVisual({ type, animateIn = false, reducedMotion = false, className }: PlantVisualProps) {
  const grow = animateIn && !reducedMotion

  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <svg viewBox="0 0 64 66" className="h-full w-full" role="img" aria-label={`Your ${type}`}>
        {/* soil mound in the pot — a sign that something is planted */}
        <path d="M22 50 Q32 43 42 50 Z" fill="oklch(0.43 0.05 60)" />

        {grow ? (
          <motion.g
            style={{ transformOrigin: "32px 50px" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.15 }}
          >
            <PlantBody type={type} />
          </motion.g>
        ) : (
          <g>
            <PlantBody type={type} />
          </g>
        )}

        <Pot />
      </svg>
    </div>
  )
}
