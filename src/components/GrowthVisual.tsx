import { cn } from "@/lib/utils"

export type GrowthStage = "seed" | "sprout" | "sapling" | "budding" | "flourishing"

interface GrowthVisualProps {
  stage: GrowthStage
  wilting?: boolean
  className?: string
}

/**
 * Stage progression mirrors streak length; `wilting` overlays a
 * drooping/desaturated look independent of stage when growth has taken damage.
 */
export function GrowthVisual({ stage, wilting = false, className }: GrowthVisualProps) {
  const leafColor = wilting ? "var(--clay)" : "var(--sprout)"
  const leafColorDeep = wilting ? "oklch(0.5 0.1 45)" : "oklch(0.45 0.1 145)"
  const droop = wilting ? 14 : 0

  return (
    <div className={cn("relative flex items-end justify-center", className)}>
      <svg
        viewBox="0 0 240 220"
        className="h-full w-full"
        role="img"
        aria-label={`Your plant is at the ${stage} stage${wilting ? ", and is wilting" : ""}`}
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

        <ellipse cx="120" cy="196" rx="58" ry="10" fill="url(#potShadow)" />

        {stage === "seed" && (
          <ellipse cx="120" cy="178" rx="7" ry="9" fill={leafColorDeep} />
        )}

        {stage === "sprout" && (
          <g>
            <path d="M120 178 C120 158, 120 150, 120 142" stroke={leafColor} strokeWidth="4" strokeLinecap="round" fill="none" />
            <path
              d="M120 150 C104 150, 96 140, 98 128 C112 130, 120 140, 120 150 Z"
              fill={leafColor}
              transform={`rotate(${droop} 120 150)`}
            />
            <path
              d="M120 150 C136 150, 144 140, 142 128 C128 130, 120 140, 120 150 Z"
              fill={leafColorDeep}
              transform={`rotate(${-droop} 120 150)`}
            />
          </g>
        )}

        {stage === "sapling" && (
          <g>
            <path d="M120 178 C120 145, 122 120, 120 100" stroke={leafColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M120 150 C98 148, 84 134, 88 116 C108 120, 120 136, 120 150 Z" fill={leafColor} transform={`rotate(${droop} 120 150)`} />
            <path d="M120 150 C142 148, 156 134, 152 116 C132 120, 120 136, 120 150 Z" fill={leafColorDeep} transform={`rotate(${-droop} 120 150)`} />
            <path d="M120 120 C104 118, 94 106, 98 92 C114 96, 120 108, 120 120 Z" fill={leafColorDeep} transform={`rotate(${droop} 120 120)`} />
            <path d="M120 120 C136 118, 146 106, 142 92 C126 96, 120 108, 120 120 Z" fill={leafColor} transform={`rotate(${-droop} 120 120)`} />
          </g>
        )}

        {stage === "budding" && (
          <g>
            <path d="M120 178 C118 140, 124 110, 120 80" stroke={leafColor} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M120 156 C94 154, 78 138, 82 116 C106 120, 120 138, 120 156 Z" fill={leafColor} transform={`rotate(${droop} 120 156)`} />
            <path d="M120 156 C146 154, 162 138, 158 116 C134 120, 120 138, 120 156 Z" fill={leafColorDeep} transform={`rotate(${-droop} 120 156)`} />
            <path d="M120 126 C100 124, 88 110, 92 92 C112 96, 120 112, 120 126 Z" fill={leafColorDeep} transform={`rotate(${droop} 120 126)`} />
            <path d="M120 126 C140 124, 152 110, 148 92 C128 96, 120 112, 120 126 Z" fill={leafColor} transform={`rotate(${-droop} 120 126)`} />
            {!wilting && (
              <circle cx="120" cy="78" r="9" fill="var(--accent)" />
            )}
            {wilting && (
              <circle cx="120" cy="78" r="7" fill={leafColorDeep} />
            )}
          </g>
        )}

        {stage === "flourishing" && (
          <g>
            <path d="M120 178 C116 130, 126 96, 120 64" stroke={leafColor} strokeWidth="6" strokeLinecap="round" fill="none" />
            <path d="M120 158 C90 156, 70 138, 76 112 C104 116, 120 138, 120 158 Z" fill={leafColor} transform={`rotate(${droop} 120 158)`} />
            <path d="M120 158 C150 156, 170 138, 164 112 C136 116, 120 138, 120 158 Z" fill={leafColorDeep} transform={`rotate(${-droop} 120 158)`} />
            <path d="M120 128 C96 126, 80 110, 86 88 C110 92, 120 112, 120 128 Z" fill={leafColorDeep} transform={`rotate(${droop} 120 128)`} />
            <path d="M120 128 C144 126, 160 110, 154 88 C130 92, 120 112, 120 128 Z" fill={leafColor} transform={`rotate(${-droop} 120 128)`} />
            <path d="M120 96 C104 94, 94 82, 98 68 C112 72, 120 84, 120 96 Z" fill={leafColor} transform={`rotate(${droop} 120 96)`} />
            <path d="M120 96 C136 94, 146 82, 142 68 C128 72, 120 84, 120 96 Z" fill={leafColorDeep} transform={`rotate(${-droop} 120 96)`} />
            {!wilting && (
              <>
                <circle cx="100" cy="66" r="6" fill="var(--accent)" />
                <circle cx="140" cy="70" r="5" fill="var(--accent)" />
                <circle cx="120" cy="58" r="6" fill="var(--accent)" />
              </>
            )}
          </g>
        )}

        {/* pot */}
        <path d="M86 178 L94 214 C94 218, 146 218, 146 214 L154 178 Z" fill="url(#potGrad)" />
        <rect x="82" y="170" width="76" height="12" rx="6" fill="oklch(0.45 0.06 60)" />
      </svg>
    </div>
  )
}
