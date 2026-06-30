import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"

export type GrowthStage = "seed" | "sprout" | "sapling" | "budding" | "flowering"

interface GrowthVisualProps {
  /** size/shape of the plant — driven by streak length */
  stage: GrowthStage
  /** total reflections — drives leaf richness + visible roots (the plant's vitality) */
  reflections?: number
  /**
   * When true, roots slowly "grow" downward from the pot (~2s ease-out) as the
   * component appears — used on the reflection confirmation to show the plant
   * getting healthier. Roots are forced visible even at 0 reflections.
   */
  animateRoots?: boolean
  wilting?: boolean
  className?: string
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type RootLevel = "none" | "faint" | "clear" | "deep"

function rootLevelFor(reflections: number): RootLevel {
  if (reflections >= 15) return "deep"
  if (reflections >= 7) return "clear"
  if (reflections >= 3) return "faint"
  return "none"
}

/** Root paths fanning down beneath the pot, richer at higher levels. */
const ROOT_PATHS: Record<Exclude<RootLevel, "none">, string[]> = {
  faint: [
    "M115 214 C112 224, 111 231, 110 239",
    "M125 214 C128 224, 129 231, 130 239",
  ],
  clear: [
    "M120 215 C120 227, 120 237, 120 247",
    "M113 214 C109 225, 106 233, 103 243",
    "M127 214 C131 225, 134 233, 137 243",
    "M120 215 C117 224, 114 229, 111 235",
  ],
  deep: [
    "M120 215 C120 228, 120 240, 120 250",
    "M112 214 C107 226, 103 236, 100 247",
    "M128 214 C133 226, 137 236, 140 247",
    "M120 216 C115 225, 110 231, 105 240",
    "M120 216 C125 225, 130 231, 135 240",
    "M108 234 C105 238, 103 241, 101 245",
    "M132 234 C135 238, 137 241, 139 245",
  ],
}

const ROOT_STYLE: Record<Exclude<RootLevel, "none">, { opacity: number; width: number }> = {
  faint: { opacity: 0.32, width: 1.6 },
  clear: { opacity: 0.5, width: 2 },
  deep: { opacity: 0.68, width: 2.4 },
}

/** Underground root color — shared so animated + static roots match exactly. */
const ROOT_COLOR = "oklch(0.42 0.045 65)"

/**
 * The plant's SIZE follows `stage` (streak); its VITALITY follows `reflections`:
 * more reflections deepen leaf green and grow visible roots. `wilting` overlays
 * a drooping, terracotta-desaturated look when growth has taken damage.
 */
export function GrowthVisual({
  stage,
  reflections = 0,
  animateRoots = false,
  wilting = false,
  className,
}: GrowthVisualProps) {
  const refl = Math.max(0, reflections)
  // richness ramps 0 → 1 across the first ~15 reflections
  const t = Math.min(refl / 15, 1)

  // Leaf greens interpolate from pale/thin (few reflections) to deep/rich (many).
  const leafColor = wilting
    ? "var(--clay)"
    : `oklch(${lerp(0.7, 0.58, t).toFixed(3)} ${lerp(0.045, 0.16, t).toFixed(3)} 145)`
  const leafColorDeep = wilting
    ? "oklch(0.5 0.1 45)"
    : `oklch(${lerp(0.52, 0.42, t).toFixed(3)} ${lerp(0.05, 0.14, t).toFixed(3)} 148)`
  const droop = wilting ? 14 : 0

  const rootLevel = rootLevelFor(refl)
  const colorTransition = { transition: "fill 0.6s ease, stroke 0.6s ease" }

  // Each path tagged with which palette role it uses, so colors animate via CSS.
  const leaf = (d: string, deep: boolean, rot: number, pivot: string) => (
    <path
      d={d}
      style={{ fill: deep ? leafColorDeep : leafColor, ...colorTransition }}
      transform={`rotate(${rot} ${pivot})`}
    />
  )

  const stem = (d: string, width: number) => (
    <path
      d={d}
      style={{ stroke: leafColor, ...colorTransition }}
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
    />
  )

  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <svg
        viewBox="0 0 240 250"
        className="h-full w-full"
        role="img"
        aria-label={`Your plant is at the ${stage} stage with ${refl} reflections${
          wilting ? ", and is wilting" : ""
        }`}
      >
        <defs>
          <radialGradient id="potShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.3 0.05 150)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="oklch(0.3 0.05 150)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.4 0.06 60)" />
            <stop offset="100%" stopColor="oklch(0.3 0.06 55)" />
          </linearGradient>
        </defs>

        <ellipse cx="120" cy="208" rx="58" ry="10" fill="url(#potShadow)" />

        {/* roots — beneath the pot */}
        {animateRoots ? (
          // Confirmation: roots slowly draw downward from the pot (~2s).
          (() => {
            const drawLevel = rootLevel === "none" ? "clear" : rootLevel
            return (
              <g
                stroke={ROOT_COLOR}
                strokeWidth={ROOT_STYLE[drawLevel].width}
                strokeLinecap="round"
                fill="none"
                style={{ opacity: ROOT_STYLE[drawLevel].opacity }}
              >
                {ROOT_PATHS[drawLevel].map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut", delay: 0.25 }}
                  />
                ))}
              </g>
            )
          })()
        ) : (
          // Home: roots fade in as reflections accumulate.
          <AnimatePresence mode="wait">
            {rootLevel !== "none" && (
              <motion.g
                key={rootLevel}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                stroke={ROOT_COLOR}
                strokeWidth={ROOT_STYLE[rootLevel].width}
                strokeLinecap="round"
                fill="none"
                style={{ opacity: ROOT_STYLE[rootLevel].opacity }}
              >
                {ROOT_PATHS[rootLevel].map((d, i) => (
                  <path key={i} d={d} />
                ))}
              </motion.g>
            )}
          </AnimatePresence>
        )}

        {/* plant body — crossfades between stages */}
        <AnimatePresence mode="wait">
          <motion.g
            key={stage}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            style={{ transformOrigin: "120px 196px" }}
          >
            {stage === "seed" && (
              <g>
                {/* mounded earth rising from the pot — a seed has been planted */}
                <path d="M96 173 Q120 151 144 173 Z" fill="oklch(0.44 0.055 61)" />
                <path d="M107 173 Q120 162 133 173 Z" fill="oklch(0.37 0.05 58)" />
                {/* the seed nestled in the soil */}
                <ellipse cx="120" cy="162" rx="4" ry="5" fill="oklch(0.53 0.07 73)" transform="rotate(-12 120 162)" />
              </g>
            )}

            {stage === "sprout" && (
              <g>
                {stem("M120 178 C120 158, 120 150, 120 142", 4)}
                {leaf("M120 150 C104 150, 96 140, 98 128 C112 130, 120 140, 120 150 Z", false, droop, "120 150")}
                {leaf("M120 150 C136 150, 144 140, 142 128 C128 130, 120 140, 120 150 Z", true, -droop, "120 150")}
              </g>
            )}

            {stage === "sapling" && (
              <g>
                {stem("M120 178 C120 145, 122 120, 120 100", 5)}
                {leaf("M120 150 C98 148, 84 134, 88 116 C108 120, 120 136, 120 150 Z", false, droop, "120 150")}
                {leaf("M120 150 C142 148, 156 134, 152 116 C132 120, 120 136, 120 150 Z", true, -droop, "120 150")}
                {leaf("M120 120 C104 118, 94 106, 98 92 C114 96, 120 108, 120 120 Z", true, droop, "120 120")}
                {leaf("M120 120 C136 118, 146 106, 142 92 C126 96, 120 108, 120 120 Z", false, -droop, "120 120")}
              </g>
            )}

            {stage === "budding" && (
              <g>
                {stem("M120 178 C118 140, 124 110, 120 80", 5)}
                {leaf("M120 156 C94 154, 78 138, 82 116 C106 120, 120 138, 120 156 Z", false, droop, "120 156")}
                {leaf("M120 156 C146 154, 162 138, 158 116 C134 120, 120 138, 120 156 Z", true, -droop, "120 156")}
                {leaf("M120 126 C100 124, 88 110, 92 92 C112 96, 120 112, 120 126 Z", true, droop, "120 126")}
                {leaf("M120 126 C140 124, 152 110, 148 92 C128 96, 120 112, 120 126 Z", false, -droop, "120 126")}
                {!wilting && <circle cx="120" cy="78" r="9" fill="var(--accent)" opacity="0.55" />}
                {!wilting && <circle cx="120" cy="80" r="5" fill="var(--accent)" />}
                {wilting && <circle cx="120" cy="78" r="7" style={{ fill: leafColorDeep }} />}
              </g>
            )}

            {stage === "flowering" && (
              <g>
                {stem("M120 178 C116 130, 126 96, 120 64", 6)}
                {leaf("M120 158 C90 156, 70 138, 76 112 C104 116, 120 138, 120 158 Z", false, droop, "120 158")}
                {leaf("M120 158 C150 156, 170 138, 164 112 C136 116, 120 138, 120 158 Z", true, -droop, "120 158")}
                {leaf("M120 128 C96 126, 80 110, 86 88 C110 92, 120 112, 120 128 Z", true, droop, "120 128")}
                {leaf("M120 128 C144 126, 160 110, 154 88 C130 92, 120 112, 120 128 Z", false, -droop, "120 128")}
                {leaf("M120 100 C104 98, 94 86, 98 72 C112 76, 120 88, 120 100 Z", false, droop, "120 100")}
                {leaf("M120 100 C136 98, 146 86, 142 72 C128 76, 120 88, 120 100 Z", true, -droop, "120 100")}
                {!wilting && (
                  <g>
                    {/* open flower */}
                    {[0, 72, 144, 216, 288].map((a) => (
                      <ellipse
                        key={a}
                        cx="120"
                        cy="52"
                        rx="7"
                        ry="13"
                        fill="var(--accent)"
                        transform={`rotate(${a} 120 62)`}
                      />
                    ))}
                    <circle cx="120" cy="62" r="6" fill="oklch(0.5 0.12 70)" />
                  </g>
                )}
              </g>
            )}
          </motion.g>
        </AnimatePresence>

        {/* pot — drawn last so it covers the stem base + root tops */}
        <path d="M86 178 L94 214 C94 218, 146 218, 146 214 L154 178 Z" fill="url(#potGrad)" />
        <rect x="82" y="170" width="76" height="12" rx="6" fill="oklch(0.45 0.06 60)" />
      </svg>
    </div>
  )
}
