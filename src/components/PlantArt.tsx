import type { ReactNode } from "react"
import { motion } from "motion/react"
import type { GrowthStage } from "@/components/GrowthVisual"
import type { PlantType } from "@/lib/profile"

// ---------------------------------------------------------------------------
// Legacy flat art — still used by succulent / herb / sapling until they get the
// same premium treatment as the flower (pending; see PlantVisual).
// ---------------------------------------------------------------------------

const LEAF = "var(--sprout)"
const LEAF_DEEP = "oklch(0.45 0.12 150)"
const POT = "oklch(0.45 0.06 60)"
const POT_RIM = "oklch(0.4 0.05 60)"

/** Shared flat terracotta pot — legacy plants only. */
export function Pot() {
  return (
    <>
      <path d="M18 50 L21 63 C21 65, 43 65, 43 63 L46 50 Z" fill={POT} />
      <rect x="15" y="46" width="34" height="6" rx="3" fill={POT_RIM} />
    </>
  )
}

/** Flat per-type plant body — legacy (succulent / herb / sapling). */
export function PlantBody({ type }: { type: PlantType }) {
  switch (type) {
    case "succulent":
      return (
        <>
          {[-62, -40, -20, 0, 20, 40, 62].map((a, i) => (
            <path
              key={a}
              d="M32 46 C27 38, 28 28, 32 22 C36 28, 37 38, 32 46 Z"
              fill={i % 2 === 0 ? LEAF : LEAF_DEEP}
              transform={`rotate(${a} 32 46)`}
            />
          ))}
          <circle cx="32" cy="42" r="3" fill={LEAF_DEEP} />
        </>
      )
    case "herb":
      return (
        <>
          <path d="M32 50 L32 30 M32 50 C26 46 24 40 24 34 M32 50 C38 46 40 40 40 34" stroke={LEAF_DEEP} strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="24" cy="32" rx="6" ry="8" fill={LEAF} transform="rotate(-25 24 32)" />
          <ellipse cx="40" cy="32" rx="6" ry="8" fill={LEAF} transform="rotate(25 40 32)" />
          <ellipse cx="27" cy="24" rx="6" ry="8" fill={LEAF_DEEP} transform="rotate(-15 27 24)" />
          <ellipse cx="37" cy="24" rx="6" ry="8" fill={LEAF_DEEP} transform="rotate(15 37 24)" />
          <ellipse cx="32" cy="19" rx="6" ry="9" fill={LEAF} />
        </>
      )
    case "sapling":
      return (
        <>
          <rect x="30" y="34" width="4" height="18" rx="2" fill="oklch(0.42 0.05 60)" />
          <circle cx="32" cy="24" r="12" fill={LEAF} />
          <circle cx="23" cy="29" r="8" fill={LEAF_DEEP} />
          <circle cx="41" cy="29" r="8" fill={LEAF_DEEP} />
          <circle cx="32" cy="20" r="9" fill={LEAF} />
        </>
      )
    case "flower":
      // Flower no longer uses the flat body — see the premium FlowerScene below.
      return null
  }
}

// ---------------------------------------------------------------------------
// Premium FLOWER illustration — prototype for the new visual fidelity.
// Soft gradients, drop shadows, a warm sun glow and grounding shadow. Shared
// viewBox `0 0 64 66`. The other three plants are pending this treatment.
// ---------------------------------------------------------------------------

const SPRING = { type: "spring" as const, stiffness: 80, damping: 14 }

/** Sun-glow ellipse geometry, shared so Home (animated) + picker (static) match. */
export const FLOWER_GLOW = { cx: 32, cy: 25, rx: 26, ry: 27 }
export const FLOWER_GLOW_BASE = 0.32

/** All gradients + soft-shadow filters for the flower scene. */
export function FlowerDefs() {
  return (
    <defs>
      <radialGradient id="fl-sun" cx="50%" cy="42%" r="55%">
        <stop offset="0%" stopColor="oklch(0.93 0.06 80)" stopOpacity="1" />
        <stop offset="100%" stopColor="oklch(0.93 0.06 80)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="fl-ground" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="oklch(0.30 0.04 60)" stopOpacity="0.30" />
        <stop offset="65%" stopColor="oklch(0.30 0.04 60)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="oklch(0.30 0.04 60)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="fl-pot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.56 0.075 56)" />
        <stop offset="100%" stopColor="oklch(0.40 0.06 52)" />
      </linearGradient>
      <linearGradient id="fl-lip" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.60 0.075 57)" />
        <stop offset="100%" stopColor="oklch(0.49 0.07 54)" />
      </linearGradient>
      <radialGradient id="fl-soil" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stopColor="oklch(0.36 0.045 56)" />
        <stop offset="100%" stopColor="oklch(0.26 0.035 50)" />
      </radialGradient>
      <linearGradient id="fl-leaf" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="oklch(0.72 0.15 142)" />
        <stop offset="100%" stopColor="oklch(0.55 0.14 148)" />
      </linearGradient>
      <linearGradient id="fl-leaf-young" x1="0.15" y1="0" x2="0.85" y2="1">
        <stop offset="0%" stopColor="oklch(0.79 0.15 138)" />
        <stop offset="100%" stopColor="oklch(0.65 0.15 142)" />
      </linearGradient>
      <linearGradient id="fl-stem" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="oklch(0.50 0.13 150)" />
        <stop offset="50%" stopColor="oklch(0.63 0.14 145)" />
        <stop offset="100%" stopColor="oklch(0.50 0.13 150)" />
      </linearGradient>
      <radialGradient id="fl-petal" cx="50%" cy="32%" r="70%">
        <stop offset="0%" stopColor="oklch(0.85 0.12 74)" />
        <stop offset="100%" stopColor="oklch(0.72 0.15 55)" />
      </radialGradient>
      <radialGradient id="fl-petal-back" cx="50%" cy="32%" r="70%">
        <stop offset="0%" stopColor="oklch(0.75 0.13 64)" />
        <stop offset="100%" stopColor="oklch(0.64 0.14 52)" />
      </radialGradient>
      <radialGradient id="fl-center" cx="50%" cy="38%" r="60%">
        <stop offset="0%" stopColor="oklch(0.58 0.11 68)" />
        <stop offset="100%" stopColor="oklch(0.42 0.09 62)" />
      </radialGradient>
      <linearGradient id="fl-seed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.62 0.07 76)" />
        <stop offset="100%" stopColor="oklch(0.47 0.06 66)" />
      </linearGradient>
      <linearGradient id="fl-bud" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.79 0.13 66)" />
        <stop offset="55%" stopColor="oklch(0.60 0.13 120)" />
        <stop offset="100%" stopColor="oklch(0.52 0.13 148)" />
      </linearGradient>
      <filter id="fl-shadow-pot" x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0.8" stdDeviation="0.9" floodColor="#3a2e22" floodOpacity="0.25" />
      </filter>
      <filter id="fl-shadow-leaf" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#1c3526" floodOpacity="0.18" />
      </filter>
    </defs>
  )
}

/** Soft horizontal grounding shadow under the pot (suggests a surface). */
export function GroundShadow() {
  return <ellipse cx="32" cy="64.4" rx="19" ry="2.4" fill="url(#fl-ground)" />
}

/** Gradient pot with a soft drop shadow, terracotta lip, and dark inner soil. */
export function PremiumPot() {
  return (
    <g>
      <path
        d="M16.5 48 L20 62.4 Q20.4 64.3 22.5 64.3 L41.5 64.3 Q43.6 64.3 44 62.4 L47.5 48 Z"
        fill="url(#fl-pot)"
        filter="url(#fl-shadow-pot)"
      />
      <ellipse cx="32" cy="47.6" rx="17.4" ry="3.3" fill="url(#fl-lip)" />
      <ellipse cx="32" cy="47.9" rx="13.8" ry="2.4" fill="url(#fl-soil)" />
    </g>
  )
}

// --- plant-part helpers (each supports a static render + a spring entrance) ---

function Stem({ d, width, animate }: { d: string; width: number; animate: boolean }) {
  if (!animate) {
    return <path d={d} stroke="url(#fl-stem)" strokeWidth={width} strokeLinecap="round" fill="none" />
  }
  return (
    <motion.path
      d={d}
      stroke="url(#fl-stem)"
      strokeWidth={width}
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: SPRING, opacity: { duration: 0.2 } }}
    />
  )
}

interface LeafProps {
  x: number
  y: number
  rot: number
  scale: number
  young?: boolean
  animate: boolean
  delay: number
}

function Leaf({ x, y, rot, scale, young = false, animate, delay }: LeafProps) {
  const grad = young ? "url(#fl-leaf-young)" : "url(#fl-leaf)"
  const content = (
    <>
      <g filter="url(#fl-shadow-leaf)">
        <path d="M0 0 C -3.6 -2.4 -4.1 -7.6 0 -11.2 C 4.1 -7.6 3.6 -2.4 0 0 Z" fill={grad} />
      </g>
      {/* highlight along the upper curve */}
      <path d="M-0.4 -2 C -2.2 -4 -2.5 -7 -0.7 -9.4" stroke="oklch(0.86 0.10 134)" strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.5" />
    </>
  )
  if (!animate) {
    return <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`}>{content}</g>
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale, opacity: 1 }}
        transition={{ ...SPRING, delay, opacity: { duration: 0.25, delay } }}
      >
        {content}
      </motion.g>
    </g>
  )
}

function Bud({ cx, cy, animate, delay }: { cx: number; cy: number; animate: boolean; delay: number }) {
  const content = (
    <>
      {/* sepals hugging the base */}
      <path d={`M${cx} ${cy + 2} C ${cx - 3} ${cy + 0.5} ${cx - 3} ${cy - 2.5} ${cx - 1.4} ${cy - 3}`} stroke="oklch(0.5 0.13 150)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d={`M${cx} ${cy + 2} C ${cx + 3} ${cy + 0.5} ${cx + 3} ${cy - 2.5} ${cx + 1.4} ${cy - 3}`} stroke="oklch(0.5 0.13 150)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      {/* closed bud — green body, warm amber tip */}
      <g filter="url(#fl-shadow-leaf)">
        <path d={`M${cx} ${cy - 6.6} C ${cx - 3.2} ${cy - 5} ${cx - 3.2} ${cy + 0.6} ${cx} ${cy + 2} C ${cx + 3.2} ${cy + 0.6} ${cx + 3.2} ${cy - 5} ${cx} ${cy - 6.6} Z`} fill="url(#fl-bud)" />
      </g>
    </>
  )
  if (!animate) return <g>{content}</g>
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING, delay, opacity: { duration: 0.3, delay } }}
    >
      {content}
    </motion.g>
  )
}

function Bloom({ cx, cy, animate, delay }: { cx: number; cy: number; animate: boolean; delay: number }) {
  const back = [36, 108, 180, 252, 324]
  const front = [0, 72, 144, 216, 288]
  const content = (
    <>
      <g filter="url(#fl-shadow-leaf)">
        {back.map((a) => (
          <ellipse key={`b${a}`} cx={cx} cy={cy - 5.8} rx="3.5" ry="5.7" fill="url(#fl-petal-back)" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        {front.map((a) => (
          <ellipse key={`f${a}`} cx={cx} cy={cy - 5.3} rx="3.1" ry="5.2" fill="url(#fl-petal)" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="2.7" fill="url(#fl-center)" />
    </>
  )
  if (!animate) return <g>{content}</g>
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: "50% 50%" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING, delay, opacity: { duration: 0.3, delay } }}
    >
      {content}
    </motion.g>
  )
}

// --- the 5 flower stages -----------------------------------------------------

/** Seed stage (streak 0–3): a soft brown seed nestled in dark soil. No green. */
export function FlowerSeed({ animate }: { animate: boolean }) {
  const seed = (
    <g filter="url(#fl-shadow-leaf)">
      <ellipse cx="32" cy="46.2" rx="2.5" ry="3.1" fill="url(#fl-seed)" transform="rotate(-14 32 46.2)" />
      <ellipse cx="31.2" cy="45.1" rx="0.8" ry="1.3" fill="oklch(0.72 0.05 82)" opacity="0.5" transform="rotate(-14 32 46.2)" />
    </g>
  )
  // a small mound of soil in front, so the seed reads as nestled / partially buried
  const soilFront = <path d="M27 47.7 Q32 45.7 37 47.7 Q32 48.6 27 47.7 Z" fill="url(#fl-soil)" />
  if (!animate) {
    return (
      <>
        {seed}
        {soilFront}
      </>
    )
  }
  return (
    <>
      <motion.g
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
        initial={{ y: -5, scale: 0.7, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={SPRING}
      >
        {seed}
      </motion.g>
      {soilFront}
    </>
  )
}

/** Sprout stage (4–7): thin delicate stem (~25%) + two tiny round cotyledons. */
export function FlowerSprout({ animate }: { animate: boolean }) {
  return (
    <>
      <Stem d="M32 47.5 C31.3 44 32.7 40.5 32 37" width={1.3} animate={animate} />
      <Leaf x={32} y={37.5} rot={-62} scale={0.5} young animate={animate} delay={0.55} />
      <Leaf x={32} y={37.5} rot={62} scale={0.5} young animate={animate} delay={0.68} />
    </>
  )
}

/** Sapling stage (8–14): sturdier stem (~50%) + 6 shaped leaves in opposite pairs. */
export function FlowerSapling({ animate }: { animate: boolean }) {
  return (
    <>
      <Stem d="M32 47.5 C30.8 41 33.2 33 32 28" width={2} animate={animate} />
      <Leaf x={31.6} y={42} rot={-52} scale={0.7} animate={animate} delay={0.5} />
      <Leaf x={32.4} y={42} rot={50} scale={0.7} animate={animate} delay={0.6} />
      <Leaf x={31.7} y={36} rot={-46} scale={0.66} animate={animate} delay={0.72} />
      <Leaf x={32.3} y={36} rot={54} scale={0.66} animate={animate} delay={0.82} />
      <Leaf x={31.9} y={30.5} rot={-40} scale={0.6} animate={animate} delay={0.94} />
      <Leaf x={32.1} y={30.5} rot={42} scale={0.6} animate={animate} delay={1.04} />
    </>
  )
}

/** Budding stage (15–30): tall stem (~85%), full leaves, one closed amber-tipped bud. */
export function FlowerBudding({ animate }: { animate: boolean }) {
  return (
    <>
      <Stem d="M32 47.5 C30.6 39 33.4 24 32 14" width={2.4} animate={animate} />
      <Leaf x={31.6} y={41} rot={-52} scale={0.98} animate={animate} delay={0.5} />
      <Leaf x={32.4} y={41} rot={50} scale={0.98} animate={animate} delay={0.6} />
      <Leaf x={31.7} y={32} rot={-46} scale={0.88} animate={animate} delay={0.74} />
      <Leaf x={32.3} y={32} rot={48} scale={0.88} animate={animate} delay={0.84} />
      <Leaf x={31.9} y={24} rot={-40} scale={0.74} animate={animate} delay={0.98} />
      <Leaf x={32.1} y={24} rot={42} scale={0.74} animate={animate} delay={1.08} />
      <Bud cx={32} cy={14} animate={animate} delay={1.2} />
    </>
  )
}

/** Flowering stage (31+): full plant, deep-green leaves, open warm-amber bloom. */
export function FlowerFlowering({ animate }: { animate: boolean }) {
  return (
    <>
      <Stem d="M32 47.5 C30.5 38 33.5 22 32 11" width={2.6} animate={animate} />
      <Leaf x={31.6} y={41} rot={-52} scale={1} animate={animate} delay={0.5} />
      <Leaf x={32.4} y={41} rot={50} scale={1} animate={animate} delay={0.6} />
      <Leaf x={31.7} y={31} rot={-46} scale={0.9} animate={animate} delay={0.74} />
      <Leaf x={32.3} y={31} rot={48} scale={0.9} animate={animate} delay={0.84} />
      <Leaf x={31.9} y={22} rot={-40} scale={0.76} animate={animate} delay={0.98} />
      <Leaf x={32.1} y={22} rot={42} scale={0.76} animate={animate} delay={1.08} />
      <Bloom cx={32} cy={10.5} animate={animate} delay={1.2} />
    </>
  )
}

/** Picks the right flower stage body. */
export function FlowerStageBody({ stage, animate }: { stage: GrowthStage; animate: boolean }) {
  switch (stage) {
    case "seed":
      return <FlowerSeed animate={animate} />
    case "sprout":
      return <FlowerSprout animate={animate} />
    case "sapling":
      return <FlowerSapling animate={animate} />
    case "budding":
      return <FlowerBudding animate={animate} />
    case "flowering":
      return <FlowerFlowering animate={animate} />
  }
}

/**
 * Full static flower scene (glow → ground → pot → plant) for one stage. Used by
 * the onboarding picker. `glow` lets a caller (Home) inject an animated glow.
 */
export function FlowerScene({
  stage,
  animate = false,
  glow,
}: {
  stage: GrowthStage
  animate?: boolean
  glow?: ReactNode
}) {
  return (
    <>
      <FlowerDefs />
      {glow ?? <ellipse {...FLOWER_GLOW} fill="url(#fl-sun)" opacity={FLOWER_GLOW_BASE} />}
      <GroundShadow />
      <PremiumPot />
      <FlowerStageBody stage={stage} animate={animate} />
    </>
  )
}

/**
 * Onboarding "choose your plant" picker — shows each plant's mature form. Flower
 * uses the premium flowering scene; the others use their (pending) flat art.
 */
export function PlantArt({ type, className }: { type: PlantType; className?: string }) {
  return (
    <svg viewBox="0 0 64 66" className={className} role="img" aria-label={`${type} illustration`}>
      {type === "flower" ? (
        <FlowerScene stage="flowering" animate={false} />
      ) : (
        <>
          <PlantBody type={type} />
          <Pot />
        </>
      )}
    </svg>
  )
}
