import type { PlantType } from "@/lib/profile"

const LEAF = "var(--sprout)"
const LEAF_DEEP = "oklch(0.45 0.12 150)"
const POT = "oklch(0.45 0.06 60)"
const POT_RIM = "oklch(0.4 0.05 60)"

/** Shared terracotta pot used as the base for each plant option. */
function Pot() {
  return (
    <>
      <path d="M18 50 L21 63 C21 65, 43 65, 43 63 L46 50 Z" fill={POT} />
      <rect x="15" y="46" width="34" height="6" rx="3" fill={POT_RIM} />
    </>
  )
}

/**
 * Small mature-form illustration for each plant type — used on the onboarding
 * "choose your plant" grid. Forest-green palette, matching GrowthVisual.
 */
export function PlantArt({ type, className }: { type: PlantType; className?: string }) {
  return (
    <svg viewBox="0 0 64 66" className={className} role="img" aria-label={`${type} illustration`}>
      {type === "succulent" && (
        <>
          {/* rosette of thick pointed leaves */}
          {[-62, -40, -20, 0, 20, 40, 62].map((a, i) => (
            <path
              key={a}
              d="M32 46 C27 38, 28 28, 32 22 C36 28, 37 38, 32 46 Z"
              fill={i % 2 === 0 ? LEAF : LEAF_DEEP}
              transform={`rotate(${a} 32 46)`}
            />
          ))}
          <circle cx="32" cy="42" r="3" fill={LEAF_DEEP} />
          <Pot />
        </>
      )}

      {type === "flower" && (
        <>
          <path d="M32 50 C31 40, 33 32, 32 24" stroke={LEAF} strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M32 40 C25 39, 21 33, 23 27 C30 28, 33 34, 32 40 Z" fill={LEAF} />
          <path d="M32 44 C39 43, 43 37, 41 31 C34 32, 31 38, 32 44 Z" fill={LEAF_DEEP} />
          {/* bloom */}
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="32" cy="16" rx="4" ry="8" fill="var(--accent)" transform={`rotate(${a} 32 23)`} />
          ))}
          <circle cx="32" cy="23" r="3.5" fill="oklch(0.5 0.12 70)" />
          <Pot />
        </>
      )}

      {type === "herb" && (
        <>
          {/* bushy paired leaves on short stems */}
          <path d="M32 50 L32 30 M32 50 C26 46 24 40 24 34 M32 50 C38 46 40 40 40 34" stroke={LEAF_DEEP} strokeWidth="2" strokeLinecap="round" fill="none" />
          <ellipse cx="24" cy="32" rx="6" ry="8" fill={LEAF} transform="rotate(-25 24 32)" />
          <ellipse cx="40" cy="32" rx="6" ry="8" fill={LEAF} transform="rotate(25 40 32)" />
          <ellipse cx="27" cy="24" rx="6" ry="8" fill={LEAF_DEEP} transform="rotate(-15 27 24)" />
          <ellipse cx="37" cy="24" rx="6" ry="8" fill={LEAF_DEEP} transform="rotate(15 37 24)" />
          <ellipse cx="32" cy="19" rx="6" ry="9" fill={LEAF} />
          <Pot />
        </>
      )}

      {type === "sapling" && (
        <>
          {/* little tree: trunk + rounded canopy */}
          <rect x="30" y="34" width="4" height="18" rx="2" fill="oklch(0.42 0.05 60)" />
          <circle cx="32" cy="24" r="12" fill={LEAF} />
          <circle cx="23" cy="29" r="8" fill={LEAF_DEEP} />
          <circle cx="41" cy="29" r="8" fill={LEAF_DEEP} />
          <circle cx="32" cy="20" r="9" fill={LEAF} />
          <Pot />
        </>
      )}
    </svg>
  )
}
