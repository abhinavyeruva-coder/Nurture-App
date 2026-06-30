import { useEffect, useRef } from "react"
import { AnimatePresence, motion, useAnimationControls } from "motion/react"
import { cn } from "@/lib/utils"
import {
  Pot,
  PlantBody,
  FlowerDefs,
  GroundShadow,
  PremiumPot,
  FlowerStageBody,
  FLOWER_GLOW,
  FLOWER_GLOW_BASE,
} from "@/components/PlantArt"
import type { GrowthStage } from "@/components/GrowthVisual"
import type { PlantType } from "@/lib/profile"

interface PlantVisualProps {
  /** which plant the user chose during onboarding */
  type: PlantType
  /** current growth stage — drives which flower stage (or legacy body) renders */
  stage: GrowthStage
  /** true during the one-time onboarding reveal (settles the seed in gently) */
  animateIn?: boolean
  /** skip all entrance/pulse animation (prefers-reduced-motion) */
  reducedMotion?: boolean
  className?: string
}

/**
 * The Home plant card.
 *
 * - Seed stage (any plant) + every flower stage use the PREMIUM scene: gradient
 *   pot, soft shadows, a warm sun glow, and per-stage art that springs in. On a
 *   stage change the new stage animates (stem → leaves → bloom) and the sun glow
 *   briefly pulses to mark the moment.
 * - The other plants (succulent / herb / sapling) past seed stage still use the
 *   flat legacy art — pending the same premium treatment in a future session.
 */
export function PlantVisual({ type, stage, animateIn = false, reducedMotion = false, className }: PlantVisualProps) {
  // Detect a genuine stage change (vs. first mount / re-mount on navigation).
  const prevStage = useRef(stage)
  const stageChanged = prevStage.current !== stage
  const glow = useAnimationControls()

  useEffect(() => {
    if (prevStage.current === stage) return
    prevStage.current = stage
    if (reducedMotion) return
    // Pulse the sun glow +25% then settle — makes a stage-up feel like an event.
    glow.start({
      opacity: [FLOWER_GLOW_BASE, FLOWER_GLOW_BASE * 1.25, FLOWER_GLOW_BASE],
      transition: { duration: 1, times: [0, 0.5, 1], ease: "easeOut" },
    })
  }, [stage, reducedMotion, glow])

  const animate = !reducedMotion && (stageChanged || animateIn)
  const usePremium = stage === "seed" || type === "flower"

  if (usePremium) {
    return (
      <div className={cn("relative flex items-end justify-center", className)}>
        <svg viewBox="0 0 64 66" className="h-full w-full" role="img" aria-label={stage === "seed" ? "Your seed" : `Your flower — ${stage}`}>
          <FlowerDefs />
          <motion.ellipse {...FLOWER_GLOW} fill="url(#fl-sun)" initial={{ opacity: FLOWER_GLOW_BASE }} animate={glow} />
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
              <FlowerStageBody stage={stage} animate={animate} />
            </motion.g>
          </AnimatePresence>
        </svg>
      </div>
    )
  }

  // Legacy flat rendering — succulent / herb / sapling past seed stage (pending).
  const grow = animateIn && !reducedMotion
  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <svg viewBox="0 0 64 66" className="h-full w-full" role="img" aria-label={`Your ${type}`}>
        <path d="M21 51 Q32 41 43 51 Z" fill="oklch(0.44 0.055 61)" />
        <path d="M25 51 Q32 46 39 51 Z" fill="oklch(0.37 0.05 58)" />
        {grow ? (
          <motion.g
            style={{ transformOrigin: "32px 51px" }}
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
