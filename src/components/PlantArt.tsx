import type { ReactNode } from "react"
import { motion } from "motion/react"
import type { GrowthStage } from "@/components/GrowthVisual"
import type { PlantType } from "@/lib/profile"

// ===========================================================================
// Premium plant illustration system. Every species shares the same pot, soil,
// sun glow, grounding shadow, and soft drop-shadow filters — only the plant on
// top changes. Each plant has 5 stages that spring in part-by-part. Shared
// viewBox `0 0 64 66`.
// ===========================================================================

const SPRING = { type: "spring" as const, stiffness: 80, damping: 14 }

/** Sun-glow geometry + resting opacity, shared so Home + picker match. */
export const PLANT_GLOW = { cx: 32, cy: 25, rx: 26, ry: 27 }
export const PLANT_GLOW_BASE = 0.32

// --- leaf shapes (base at 0,0, tip pointing up) ----------------------------
const LEAF_TEARDROP = "M0 0 C -3.6 -2.4 -4.1 -7.6 0 -11.2 C 4.1 -7.6 3.6 -2.4 0 0 Z"
const HL_TEARDROP = "M-0.4 -2 C -2.2 -4 -2.5 -7 -0.7 -9.4"
const LEAF_FLESHY = "M0 0 C -3.5 -3.5 -3.1 -8.6 0 -11.8 C 3.1 -8.6 3.5 -3.5 0 0 Z"
const HL_FLESHY = "M0 -2.2 C -1.3 -4.8 -1.3 -7.8 0 -10"
const LEAF_OVAL = "M0 0 C -4.3 -2.6 -4.3 -7.6 0 -10.8 C 4.3 -7.6 4.3 -2.6 0 0 Z"
const LEAF_COT = "M0 0 C -3 -1 -3.4 -4.6 0 -5.8 C 3.4 -4.6 3 -1 0 0 Z"
const LEAF_TREE = "M0 0 C -2.9 -1.6 -3.1 -5.6 0 -7.9 C 3.1 -5.6 2.9 -1.6 0 0 Z"

/** All gradients + soft-shadow filters for every plant scene. */
export function PlantDefs() {
  return (
    <defs>
      {/* shared scene */}
      <radialGradient id="pl-sun" cx="50%" cy="42%" r="55%">
        <stop offset="0%" stopColor="oklch(0.93 0.06 80)" stopOpacity="1" />
        <stop offset="100%" stopColor="oklch(0.93 0.06 80)" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pl-ground" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="oklch(0.30 0.04 60)" stopOpacity="0.30" />
        <stop offset="65%" stopColor="oklch(0.30 0.04 60)" stopOpacity="0.12" />
        <stop offset="100%" stopColor="oklch(0.30 0.04 60)" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="pl-pot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.56 0.075 56)" />
        <stop offset="100%" stopColor="oklch(0.40 0.06 52)" />
      </linearGradient>
      <linearGradient id="pl-lip" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.60 0.075 57)" />
        <stop offset="100%" stopColor="oklch(0.49 0.07 54)" />
      </linearGradient>
      <radialGradient id="pl-soil" cx="50%" cy="38%" r="65%">
        <stop offset="0%" stopColor="oklch(0.36 0.045 56)" />
        <stop offset="100%" stopColor="oklch(0.26 0.035 50)" />
      </radialGradient>
      <linearGradient id="pl-seed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.62 0.07 76)" />
        <stop offset="100%" stopColor="oklch(0.47 0.06 66)" />
      </linearGradient>
      {/* flower */}
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
      <linearGradient id="fl-bud" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.79 0.13 66)" />
        <stop offset="55%" stopColor="oklch(0.60 0.13 120)" />
        <stop offset="100%" stopColor="oklch(0.52 0.13 148)" />
      </linearGradient>
      {/* succulent — cooler sage, two depth layers + reddish-tipped outer leaves */}
      <linearGradient id="succ-leaf" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="oklch(0.74 0.07 158)" />
        <stop offset="100%" stopColor="oklch(0.56 0.08 162)" />
      </linearGradient>
      <linearGradient id="succ-leaf-back" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="oklch(0.66 0.07 160)" />
        <stop offset="100%" stopColor="oklch(0.50 0.08 163)" />
      </linearGradient>
      <linearGradient id="succ-tip" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="oklch(0.62 0.13 33)" />
        <stop offset="42%" stopColor="oklch(0.62 0.09 70)" />
        <stop offset="100%" stopColor="oklch(0.56 0.08 162)" />
      </linearGradient>
      <radialGradient id="succ-star" cx="50%" cy="38%" r="62%">
        <stop offset="0%" stopColor="oklch(0.97 0.012 95)" />
        <stop offset="100%" stopColor="oklch(0.89 0.02 95)" />
      </radialGradient>
      {/* herb — muted basil green (restrained chroma), darker + textured later */}
      <linearGradient id="herb-leaf" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="oklch(0.70 0.11 140)" />
        <stop offset="100%" stopColor="oklch(0.52 0.11 148)" />
      </linearGradient>
      <linearGradient id="herb-leaf-deep" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="oklch(0.60 0.11 144)" />
        <stop offset="100%" stopColor="oklch(0.44 0.11 150)" />
      </linearGradient>
      <linearGradient id="herb-stem" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="oklch(0.46 0.10 150)" />
        <stop offset="50%" stopColor="oklch(0.58 0.11 144)" />
        <stop offset="100%" stopColor="oklch(0.46 0.10 150)" />
      </linearGradient>
      {/* tree — woody trunk + layered canopy */}
      <linearGradient id="tree-leaf" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="oklch(0.66 0.14 146)" />
        <stop offset="100%" stopColor="oklch(0.48 0.12 151)" />
      </linearGradient>
      <linearGradient id="tree-leaf-deep" x1="0.2" y1="0" x2="0.8" y2="1">
        <stop offset="0%" stopColor="oklch(0.58 0.13 148)" />
        <stop offset="100%" stopColor="oklch(0.42 0.11 152)" />
      </linearGradient>
      <linearGradient id="tree-trunk" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="oklch(0.36 0.05 56)" />
        <stop offset="50%" stopColor="oklch(0.48 0.055 60)" />
        <stop offset="100%" stopColor="oklch(0.36 0.05 56)" />
      </linearGradient>
      <radialGradient id="tree-blossom" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="oklch(0.88 0.06 16)" />
        <stop offset="100%" stopColor="oklch(0.80 0.08 18)" />
      </radialGradient>
      {/* soft shadows (shared) */}
      <filter id="pl-shadow-pot" x="-30%" y="-20%" width="160%" height="160%">
        <feDropShadow dx="0" dy="0.8" stdDeviation="0.9" floodColor="#3a2e22" floodOpacity="0.25" />
      </filter>
      <filter id="pl-shadow-leaf" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0.5" stdDeviation="0.5" floodColor="#1c3526" floodOpacity="0.18" />
      </filter>
    </defs>
  )
}

/** Soft horizontal grounding shadow under the pot. */
export function GroundShadow() {
  return <ellipse cx="32" cy="64.4" rx="19" ry="2.4" fill="url(#pl-ground)" />
}

/** Gradient pot, soft drop shadow, terracotta lip, dark inner soil. */
export function PremiumPot() {
  return (
    <g>
      <path
        d="M16.5 48 L20 62.4 Q20.4 64.3 22.5 64.3 L41.5 64.3 Q43.6 64.3 44 62.4 L47.5 48 Z"
        fill="url(#pl-pot)"
        filter="url(#pl-shadow-pot)"
      />
      <ellipse cx="32" cy="47.6" rx="17.4" ry="3.3" fill="url(#pl-lip)" />
      <ellipse cx="32" cy="47.9" rx="13.8" ry="2.4" fill="url(#pl-soil)" />
    </g>
  )
}

// --- shared plant-part helpers (static render + spring entrance) -------------

function Stem({ d, width, gradId = "fl-stem", animate }: { d: string; width: number; gradId?: string; animate: boolean }) {
  if (!animate) {
    return <path d={d} stroke={`url(#${gradId})`} strokeWidth={width} strokeLinecap="round" fill="none" />
  }
  return (
    <motion.path
      d={d}
      stroke={`url(#${gradId})`}
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
  path?: string
  gradId?: string
  hl?: string
  hlColor?: string
  animate: boolean
  delay: number
}

function Leaf({ x, y, rot, scale, path = LEAF_TEARDROP, gradId = "fl-leaf", hl, hlColor = "oklch(0.86 0.10 134)", animate, delay }: LeafProps) {
  const content = (
    <>
      <g filter="url(#pl-shadow-leaf)">
        <path d={path} fill={`url(#${gradId})`} />
      </g>
      {hl && <path d={hl} stroke={hlColor} strokeWidth="0.6" strokeLinecap="round" fill="none" opacity="0.5" />}
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

/** Generic spring-in group for an "accent" (bloom, bud, canopy, starflower). */
function Pop({ children, origin = "50% 100%", animate, delay }: { children: ReactNode; origin?: string; animate: boolean; delay: number }) {
  if (!animate) return <g>{children}</g>
  return (
    <motion.g
      style={{ transformBox: "fill-box", transformOrigin: origin }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ ...SPRING, delay, opacity: { duration: 0.3, delay } }}
    >
      {children}
    </motion.g>
  )
}

// ===========================================================================
// Shared SEED stage — a soft brown seed mostly buried in the soil, only its
// top peeking out, with a small contact shadow. Used by every plant.
// ===========================================================================

export function SeedStage({ animate }: { animate: boolean }) {
  const seed = (
    <>
      <ellipse cx="32" cy="45.4" rx="2.4" ry="3" fill="url(#pl-seed)" transform="rotate(-12 32 45.4)" />
      <ellipse cx="31.2" cy="44.2" rx="0.7" ry="1.1" fill="oklch(0.72 0.05 82)" opacity="0.5" transform="rotate(-12 32 45.4)" />
    </>
  )
  return (
    <>
      {animate ? (
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={SPRING}
        >
          {seed}
        </motion.g>
      ) : (
        seed
      )}
      {/* soil mound buries the lower ~75% of the seed */}
      <path d="M24.5 48 Q32 43.4 39.5 48 Q32 49.3 24.5 48 Z" fill="url(#pl-soil)" />
      {/* soft contact shadow where the seed meets the soil */}
      <ellipse cx="32" cy="44.1" rx="2.7" ry="0.7" fill="#241c14" opacity="0.22" />
    </>
  )
}

// ===========================================================================
// FLOWER
// ===========================================================================

function FlowerLeaves({ animate, scaleTop }: { animate: boolean; scaleTop: number }) {
  return (
    <>
      <Leaf x={31.6} y={41} rot={-52} scale={1} hl={HL_TEARDROP} animate={animate} delay={0.5} />
      <Leaf x={32.4} y={41} rot={50} scale={1} hl={HL_TEARDROP} animate={animate} delay={0.6} />
      <Leaf x={31.7} y={31} rot={-46} scale={0.9} hl={HL_TEARDROP} animate={animate} delay={0.74} />
      <Leaf x={32.3} y={31} rot={48} scale={0.9} hl={HL_TEARDROP} animate={animate} delay={0.84} />
      <Leaf x={31.9} y={22} rot={-40} scale={scaleTop} hl={HL_TEARDROP} animate={animate} delay={0.98} />
      <Leaf x={32.1} y={22} rot={42} scale={scaleTop} hl={HL_TEARDROP} animate={animate} delay={1.08} />
    </>
  )
}

function Bloom({ animate, delay }: { animate: boolean; delay: number }) {
  const cx = 32
  const cy = 10.5
  return (
    <Pop origin="50% 50%" animate={animate} delay={delay}>
      <g filter="url(#pl-shadow-leaf)">
        {[36, 108, 180, 252, 324].map((a) => (
          <ellipse key={`b${a}`} cx={cx} cy={cy - 5.8} rx="3.5" ry="5.7" fill="url(#fl-petal-back)" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={`f${a}`} cx={cx} cy={cy - 5.3} rx="3.1" ry="5.2" fill="url(#fl-petal)" transform={`rotate(${a} ${cx} ${cy})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r="2.7" fill="url(#fl-center)" />
    </Pop>
  )
}

function FlowerStage({ stage, animate }: { stage: GrowthStage; animate: boolean }) {
  switch (stage) {
    case "sprout":
      return (
        <>
          <Stem d="M32 47.5 C31.3 44 32.7 40.5 32 37" width={1.3} animate={animate} />
          <Leaf x={32} y={37.5} rot={-62} scale={0.5} path={LEAF_COT} gradId="fl-leaf-young" animate={animate} delay={0.55} />
          <Leaf x={32} y={37.5} rot={62} scale={0.5} path={LEAF_COT} gradId="fl-leaf-young" animate={animate} delay={0.68} />
        </>
      )
    case "sapling":
      return (
        <>
          <Stem d="M32 47.5 C30.8 41 33.2 33 32 28" width={2} animate={animate} />
          <Leaf x={31.6} y={42} rot={-52} scale={0.7} hl={HL_TEARDROP} animate={animate} delay={0.5} />
          <Leaf x={32.4} y={42} rot={50} scale={0.7} hl={HL_TEARDROP} animate={animate} delay={0.6} />
          <Leaf x={31.7} y={36} rot={-46} scale={0.66} hl={HL_TEARDROP} animate={animate} delay={0.72} />
          <Leaf x={32.3} y={36} rot={54} scale={0.66} hl={HL_TEARDROP} animate={animate} delay={0.82} />
          <Leaf x={31.9} y={30.5} rot={-40} scale={0.6} hl={HL_TEARDROP} animate={animate} delay={0.94} />
          <Leaf x={32.1} y={30.5} rot={42} scale={0.6} hl={HL_TEARDROP} animate={animate} delay={1.04} />
        </>
      )
    case "budding":
      return (
        <>
          <Stem d="M32 47.5 C30.6 39 33.4 24 32 14" width={2.4} animate={animate} />
          <FlowerLeaves animate={animate} scaleTop={0.74} />
          <Pop animate={animate} delay={1.2}>
            <path d="M30.6 15 C29.2 13 30 10.5 32 11" stroke="oklch(0.5 0.13 150)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M33.4 15 C34.8 13 34 10.5 32 11" stroke="oklch(0.5 0.13 150)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <g filter="url(#pl-shadow-leaf)">
              <path d="M32 7.4 C28.8 9 28.8 14.6 32 16 C35.2 14.6 35.2 9 32 7.4 Z" fill="url(#fl-bud)" />
            </g>
          </Pop>
        </>
      )
    case "flowering":
      return (
        <>
          <Stem d="M32 47.5 C30.5 38 33.5 22 32 11" width={2.6} animate={animate} />
          <FlowerLeaves animate={animate} scaleTop={0.76} />
          <Bloom animate={animate} delay={1.2} />
        </>
      )
    default:
      return null
  }
}

// ===========================================================================
// SUCCULENT — low rosette, no stem, cooler sage, reddish tips + starflower
// ===========================================================================

interface RosetteLeaf {
  rot: number
  scale: number
  back?: boolean
  tip?: boolean
}

function Rosette({ cy, leaves, animate, baseDelay = 0.5 }: { cy: number; leaves: RosetteLeaf[]; animate: boolean; baseDelay?: number }) {
  // back layer first for depth, then front
  const ordered = [...leaves].sort((a, b) => Number(b.back) - Number(a.back))
  return (
    <>
      {ordered.map((l, i) => (
        <Leaf
          key={i}
          x={32}
          y={cy}
          rot={l.rot}
          scale={l.scale}
          path={LEAF_FLESHY}
          gradId={l.tip ? "succ-tip" : l.back ? "succ-leaf-back" : "succ-leaf"}
          hl={l.back ? undefined : HL_FLESHY}
          hlColor="oklch(0.88 0.05 158)"
          animate={animate}
          delay={baseDelay + i * 0.09}
        />
      ))}
    </>
  )
}

function Starflower({ animate, delay }: { animate: boolean; delay: number }) {
  const cx = 32
  const cy = 31
  return (
    <Pop origin="50% 50%" animate={animate} delay={delay}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx={cx} cy={cy - 2.3} rx="1.2" ry="2.4" fill="url(#succ-star)" transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r="1.2" fill="oklch(0.85 0.10 95)" />
    </Pop>
  )
}

function SucculentStage({ stage, animate }: { stage: GrowthStage; animate: boolean }) {
  switch (stage) {
    case "sprout":
      return <Rosette cy={46} leaves={[{ rot: -32, scale: 0.42 }, { rot: 0, scale: 0.46 }, { rot: 32, scale: 0.42 }]} animate={animate} />
    case "sapling":
      return (
        <Rosette
          cy={46}
          leaves={[
            { rot: -72, scale: 0.56, back: true },
            { rot: 72, scale: 0.56, back: true },
            { rot: -40, scale: 0.64 },
            { rot: 0, scale: 0.7 },
            { rot: 40, scale: 0.64 },
          ]}
          animate={animate}
        />
      )
    case "budding":
      return (
        <Rosette
          cy={46}
          leaves={[
            { rot: -84, scale: 0.6, back: true },
            { rot: -56, scale: 0.66, back: true },
            { rot: 56, scale: 0.66, back: true },
            { rot: 84, scale: 0.6, back: true },
            { rot: -42, scale: 0.74 },
            { rot: -16, scale: 0.8 },
            { rot: 16, scale: 0.8 },
            { rot: 42, scale: 0.74 },
            { rot: 0, scale: 0.84 },
          ]}
          animate={animate}
        />
      )
    case "flowering":
      return (
        <>
          <Rosette
            cy={46}
            leaves={[
              { rot: -88, scale: 0.62, back: true, tip: true },
              { rot: -62, scale: 0.68, back: true, tip: true },
              { rot: 62, scale: 0.68, back: true, tip: true },
              { rot: 88, scale: 0.62, back: true, tip: true },
              { rot: -46, scale: 0.78 },
              { rot: -22, scale: 0.86 },
              { rot: 0, scale: 0.9 },
              { rot: 22, scale: 0.86 },
              { rot: 46, scale: 0.78 },
              { rot: -34, scale: 0.7 },
              { rot: 34, scale: 0.7 },
            ]}
            animate={animate}
          />
          <Starflower animate={animate} delay={1.15} />
        </>
      )
    default:
      return null
  }
}

// ===========================================================================
// HERB — upright, branching basil; muted greens, oval veined leaves
// ===========================================================================

function herbLeaf(x: number, y: number, rot: number, scale: number, deep: boolean, animate: boolean, delay: number) {
  return (
    <Leaf
      key={`${x}-${y}-${rot}`}
      x={x}
      y={y}
      rot={rot}
      scale={scale}
      path={LEAF_OVAL}
      gradId={deep ? "herb-leaf-deep" : "herb-leaf"}
      hl="M0 -1.4 L0 -9.2"
      hlColor="oklch(0.8 0.07 138)"
      animate={animate}
      delay={delay}
    />
  )
}

function whiteBuds(cx: number, cy: number) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="1" fill="oklch(0.95 0.012 110)" />
      <circle cx={cx - 1.6} cy={cy + 1} r="0.8" fill="oklch(0.93 0.012 110)" />
      <circle cx={cx + 1.6} cy={cy + 1} r="0.8" fill="oklch(0.93 0.012 110)" />
      <circle cx={cx} cy={cy + 2.1} r="0.7" fill="oklch(0.91 0.012 110)" />
    </g>
  )
}

function HerbStage({ stage, animate }: { stage: GrowthStage; animate: boolean }) {
  switch (stage) {
    case "sprout":
      return (
        <>
          <Stem d="M32 47.5 C31.4 44 32.6 41 32 38" width={1.3} gradId="herb-stem" animate={animate} />
          <Leaf x={32} y={38.5} rot={-58} scale={0.62} path={LEAF_COT} gradId="herb-leaf" animate={animate} delay={0.55} />
          <Leaf x={32} y={38.5} rot={58} scale={0.62} path={LEAF_COT} gradId="herb-leaf" animate={animate} delay={0.68} />
        </>
      )
    case "sapling":
      return (
        <>
          <Stem d="M32 47.5 C31 41 33 33 32 29" width={1.7} gradId="herb-stem" animate={animate} />
          {herbLeaf(31.4, 42, -54, 0.62, false, animate, 0.5)}
          {herbLeaf(32.6, 42, 52, 0.62, false, animate, 0.6)}
          {herbLeaf(31.6, 35, -48, 0.58, false, animate, 0.72)}
          {herbLeaf(32.4, 35, 52, 0.58, false, animate, 0.82)}
          {herbLeaf(32, 30, 0, 0.5, false, animate, 0.94)}
        </>
      )
    case "budding":
      return (
        <>
          <Stem d="M32 47.5 C31.4 42 32.4 30 32 24" width={2} gradId="herb-stem" animate={animate} />
          <Stem d="M32 38 C29 35 26.5 31 26 27" width={1.5} gradId="herb-stem" animate={animate} />
          <Stem d="M32 38 C35 35 37.5 31 38 27" width={1.5} gradId="herb-stem" animate={animate} />
          {herbLeaf(26, 26.5, -40, 0.6, false, animate, 0.6)}
          {herbLeaf(38, 26.5, 40, 0.6, false, animate, 0.7)}
          {herbLeaf(31.4, 33, -50, 0.66, false, animate, 0.82)}
          {herbLeaf(32.6, 33, 50, 0.66, false, animate, 0.92)}
          {herbLeaf(32, 24, 0, 0.66, false, animate, 1.04)}
        </>
      )
    case "flowering":
      return (
        <>
          <Stem d="M32 47.5 C31.4 42 32.4 28 32 22" width={2.2} gradId="herb-stem" animate={animate} />
          <Stem d="M32 36 C28 33 24.5 28 24 23" width={1.7} gradId="herb-stem" animate={animate} />
          <Stem d="M32 36 C36 33 39.5 28 40 23" width={1.7} gradId="herb-stem" animate={animate} />
          {herbLeaf(24, 22.5, -42, 0.74, true, animate, 0.55)}
          {herbLeaf(40, 22.5, 42, 0.74, true, animate, 0.65)}
          {herbLeaf(31.2, 32, -52, 0.8, true, animate, 0.78)}
          {herbLeaf(32.8, 32, 52, 0.8, true, animate, 0.88)}
          {herbLeaf(30.8, 24, -44, 0.72, true, animate, 1.0)}
          {herbLeaf(33.2, 24, 44, 0.72, true, animate, 1.1)}
          <Pop origin="50% 100%" animate={animate} delay={1.2}>
            {whiteBuds(24, 18)}
            {whiteBuds(40, 18)}
            {whiteBuds(32, 18)}
          </Pop>
        </>
      )
    default:
      return null
  }
}

// ===========================================================================
// TREE (sapling) — woody trunk, canopy of overlapping gradient blobs, blossoms
// ===========================================================================

function Trunk({ d, width, animate }: { d: string; width: number; animate: boolean }) {
  return <Stem d={d} width={width} gradId="tree-trunk" animate={animate} />
}

function Canopy({ cx, cy, animate, delay, blossoms }: { cx: number; cy: number; animate: boolean; delay: number; blossoms?: boolean }) {
  const blobs = [
    { dx: 0, dy: 1, r: 9, deep: true },
    { dx: -6.5, dy: 2.5, r: 6, deep: true },
    { dx: 6.5, dy: 2.5, r: 6, deep: true },
    { dx: -3.5, dy: -4, r: 6.5, deep: false },
    { dx: 3.5, dy: -4, r: 6.5, deep: false },
    { dx: 0, dy: -1, r: 7, deep: false },
  ]
  return (
    <Pop origin="50% 100%" animate={animate} delay={delay}>
      <g filter="url(#pl-shadow-leaf)">
        {blobs.map((b, i) => (
          <circle key={i} cx={cx + b.dx} cy={cy + b.dy} r={b.r} fill={b.deep ? "url(#tree-leaf-deep)" : "url(#tree-leaf)"} />
        ))}
      </g>
      {/* highlight arcs */}
      <path d={`M${cx - 5} ${cy - 4} Q${cx - 1} ${cy - 7} ${cx + 3} ${cy - 5.5}`} stroke="oklch(0.78 0.1 140)" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.5" />
      {blossoms && (
        <g>
          {[
            [cx - 5, cy - 1],
            [cx + 4, cy - 3],
            [cx - 1, cy + 4],
            [cx + 6, cy + 2],
            [cx + 1, cy - 6],
          ].map(([bx, by], i) => (
            <circle key={i} cx={bx} cy={by} r="1.2" fill="url(#tree-blossom)" />
          ))}
        </g>
      )}
    </Pop>
  )
}

function TreeStage({ stage, animate }: { stage: GrowthStage; animate: boolean }) {
  switch (stage) {
    case "sprout":
      // sturdier, straighter woody stem with a browner base + a single oval leaf
      return (
        <>
          <ellipse cx="32" cy="46.5" rx="2.6" ry="1.3" fill="oklch(0.4 0.05 58)" />
          <Trunk d="M32 47 L31.7 39" width={2.4} animate={animate} />
          <Leaf x={31.7} y={39.5} rot={28} scale={0.62} path={LEAF_OVAL} gradId="tree-leaf" hl="M0 -1.4 L0 -8.6" hlColor="oklch(0.78 0.1 142)" animate={animate} delay={0.55} />
        </>
      )
    case "sapling":
      return (
        <>
          <Trunk d="M32 47 C31.6 40 32.2 34 32 30" width={2.6} animate={animate} />
          <Leaf x={31.6} y={41} rot={-46} scale={0.56} path={LEAF_TREE} animate={animate} delay={0.5} />
          <Leaf x={32.4} y={41} rot={46} scale={0.56} path={LEAF_TREE} animate={animate} delay={0.6} />
          <Leaf x={31.7} y={35} rot={-40} scale={0.54} path={LEAF_TREE} animate={animate} delay={0.72} />
          <Leaf x={32.3} y={35} rot={42} scale={0.54} path={LEAF_TREE} animate={animate} delay={0.82} />
          <Leaf x={32} y={30} rot={0} scale={0.5} path={LEAF_TREE} animate={animate} delay={0.94} />
        </>
      )
    case "budding":
      return (
        <>
          <Trunk d="M32 47 C31.7 40 32.3 32 32 27" width={3} animate={animate} />
          <Trunk d="M32 33 C29 31 27 28 26.5 25" width={2} animate={animate} />
          <Trunk d="M32 33 C35 31 37 28 37.5 25" width={2} animate={animate} />
          <Canopy cx={32} cy={22} animate={animate} delay={0.7} />
        </>
      )
    case "flowering":
      return (
        <>
          <Trunk d="M32 47 C31.7 40 32.3 31 32 26" width={3.2} animate={animate} />
          <Trunk d="M32 32 C28.5 30 26 27 25.5 24" width={2.1} animate={animate} />
          <Trunk d="M32 32 C35.5 30 38 27 38.5 24" width={2.1} animate={animate} />
          <Canopy cx={32} cy={20} animate={animate} delay={0.7} blossoms />
        </>
      )
    default:
      return null
  }
}

// ===========================================================================
// Routing
// ===========================================================================

/** Renders the right plant body for a type + stage (seed is shared). */
export function PlantStageBody({ type, stage, animate }: { type: PlantType; stage: GrowthStage; animate: boolean }) {
  if (stage === "seed") return <SeedStage animate={animate} />
  switch (type) {
    case "flower":
      return <FlowerStage stage={stage} animate={animate} />
    case "succulent":
      return <SucculentStage stage={stage} animate={animate} />
    case "herb":
      return <HerbStage stage={stage} animate={animate} />
    case "sapling":
      return <TreeStage stage={stage} animate={animate} />
  }
}

/**
 * Full static scene (glow → ground → pot → plant) for one type + stage. Used by
 * the onboarding picker; `glow` lets Home inject an animated, pulsing glow.
 */
export function PlantScene({
  type,
  stage,
  animate = false,
  glow,
}: {
  type: PlantType
  stage: GrowthStage
  animate?: boolean
  glow?: ReactNode
}) {
  return (
    <>
      <PlantDefs />
      {glow ?? <ellipse {...PLANT_GLOW} fill="url(#pl-sun)" opacity={PLANT_GLOW_BASE} />}
      <GroundShadow />
      <PremiumPot />
      <PlantStageBody type={type} stage={stage} animate={animate} />
    </>
  )
}

/**
 * Onboarding "choose your plant" picker — shows each plant's mature form, all
 * now in the premium style.
 */
export function PlantArt({ type, className }: { type: PlantType; className?: string }) {
  return (
    <svg viewBox="0 0 64 66" className={className} role="img" aria-label={`${type} illustration`}>
      <PlantScene type={type} stage="flowering" animate={false} />
    </svg>
  )
}
