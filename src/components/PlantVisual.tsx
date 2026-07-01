import { useEffect, useRef } from "react"
import { AnimatePresence, motion, useAnimationControls } from "motion/react"
import { cn } from "@/lib/utils"
import {
  PlantDefs,
  GroundShadow,
  PremiumPot,
  PlantStageBody,
  PLANT_GLOW,
  PLANT_GLOW_BASE,
} from "@/components/PlantArt"
import type { GrowthStage } from "@/components/GrowthVisual"
import type { PlantType } from "@/lib/profile"

interface PlantVisualProps {
  /** which plant the user chose during onboarding */
  type: PlantType
  /** current growth stage — drives which stage art renders */
  stage: GrowthStage
  /** true during the one-time onboarding reveal (settles the seed in + pulses) */
  animateIn?: boolean
  /** skip all entrance/pulse animation (prefers-reduced-motion) */
  reducedMotion?: boolean
  className?: string
}

const glowPulse = {
  opacity: [PLANT_GLOW_BASE, PLANT_GLOW_BASE * 1.25, PLANT_GLOW_BASE],
  transition: { duration: 1, times: [0, 0.5, 1], ease: "easeOut" as const },
}

/**
 * The Home plant card. Every species now uses the premium scene — gradient pot,
 * soft shadows, a warm sun glow, and per-stage art that springs in stem → leaves
 * → bloom. On a stage change (and once on the onboarding reveal) the sun glow
 * pulses to mark the moment.
 */
export function PlantVisual({ type, stage, animateIn = false, reducedMotion = false, className }: PlantVisualProps) {
  const prevStage = useRef(stage)
  const stageChanged = prevStage.current !== stage
  const glow = useAnimationControls()
  const didIntroPulse = useRef(false)

  // Pulse the glow on a genuine stage change.
  useEffect(() => {
    if (prevStage.current === stage) return
    prevStage.current = stage
    if (!reducedMotion) glow.start(glowPulse)
  }, [stage, reducedMotion, glow])

  // Pulse once on the onboarding reveal — signals the start of the journey.
  useEffect(() => {
    if (animateIn && !reducedMotion && !didIntroPulse.current) {
      didIntroPulse.current = true
      glow.start(glowPulse)
    }
  }, [animateIn, reducedMotion, glow])

  const animate = !reducedMotion && (stageChanged || animateIn)

  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <svg viewBox="0 0 64 66" className="h-full w-full" role="img" aria-label={stage === "seed" ? "Your seed" : `Your ${type} — ${stage}`}>
        <PlantDefs />
        <motion.ellipse {...PLANT_GLOW} fill="url(#pl-sun)" initial={{ opacity: PLANT_GLOW_BASE }} animate={glow} />
        <GroundShadow />
        <PremiumPot />
        {/* swap only the plant on stage change; pot + glow stay put */}
        <AnimatePresence mode="wait">
          <motion.g
            key={stage}
            initial={animate ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PlantStageBody type={type} stage={stage} animate={animate} />
          </motion.g>
        </AnimatePresence>
      </svg>
    </div>
  )
}
