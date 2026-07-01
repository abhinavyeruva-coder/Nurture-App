# Nurture — Project Context for Claude Code

## What this app is

Nurture is a mobile-first habit tracker where consistency grows a living thing. The user picks a habit, picks a living thing (plant, creature, or landscape — currently a plant), and checks in daily through a short AI conversation. The plant grows from showing up. The plant gets vibrant and develops deep roots from honest reflection. The healthiest plant belongs to users who do both.

This is NOT just a streak app. It's a self-awareness tool disguised as a habit app.

## Core design philosophy

- One habit at a time, max two. Never let users add many habits. Constraint is a feature.
- Floor effort = 2 minutes, two short answers. Always. No forced depth.
- Optional depth. The AI may offer one follow-up question if the user wrote something meaningful. Users can skip.
- No "free pass" rewards for missing. Honesty is rewarded through reflection-driven plant vitality, not through reduced accountability.
- No shame on No days. Confirmation copy stays warm and non-judgmental.

## Visual style — locked in

- Aesthetic: Organic Biophilic
- Use UI/UX Pro Max skill (installed at `.claude/skills/`)
- Use shadcn/ui components
- Color palette: deep forest greens, warm creams. No generic blues, no AI purple gradients.
- Fonts: Fraunces for headings, Manrope for body
- Premium wellness app feel — clean, minimal, Gen Z friendly
- Mobile container: ~420px max-width, centered, with proper safe-area-inset-top padding

## Screens built so far

- **Onboarding (first run)** — 7-step flow shown when there's no saved profile: (1) Welcome, (2) Name, (3) Habit, (4) Why it matters, (5) When (Morning/Afternoon/Evening/Anytime chips), (6) Choose your plant (Succulent / Flower / Herb / Sapling, mature-form picker), (7) The planting moment (seed drops + buries, then "Your journey to {habit} starts now, {name}."). Progress dots count steps 2–6. On finish it saves a `UserProfile` to localStorage and springs into Home (continuous reveal — see below).
- **Home screen** — Welcome header (`Welcome back, {name}`), plant card showing the user's chosen plant species at its current growth stage + stage label ("Sapling — 5 days until Budding", or "Seed — Day 1 of your journey" for a new user), stage-progress bar, 3 stat cards (Streak / Reflections / Longest), link to Growth Log, check-in CTA (persists "Checked in ✓" when today is already logged).
- **Daily Check-in** — Branches based on Yes/No answer, one question per screen, soft transitions
  - Yes flow: "How did it feel?" / "What helped you show up today?"
  - No flow: "What got in the way?" / "What would make tomorrow different?"
  - Yes confirmation: "Your plant has been watered. See you tomorrow."
  - No confirmation: "Honesty is its own kind of growth." (plays a roots-growing animation via `GrowthVisual`)
  - Yes increments streak. No does NOT increment streak. Both count toward Reflections counter if user wrote a response. Every check-in is saved to the profile's `checkIns[]` in localStorage.
- **Growth Log** — Monthly calendar view (driven by the profile's real `checkIns`) with green dots for Yes days, soft red for No days, neutral for empty. Today has a subtle ring. Tapping a checked-in day opens a detail view with both reflections. Legend: green = "Showed up", red = "Reflected".

## The plant system

Plant STAGE is driven by streak (`stageFromStreak` in `App.tsx`):

- Seed: Days 0-3
- Sprout: Days 4-7
- Sapling: Days 8-14
- Budding: Days 15-30
- Flowering: Day 31+

The user picks a **species** at onboarding (`succulent` / `flower` / `herb` / `sapling`), stored in the profile. The Home plant card renders that species at its current stage via `PlantVisual` → `PlantArt`. **All 5 stages of all 4 species now have premium, hand-built SVG art** (gradients, soft drop shadows, warm sun glow, grounding shadow, gradient pot). Each species keeps its identity at every stage (e.g. succulent = low rosette, sapling = woody tree with a canopy).

- **Seed stage is shared across all species** — a soft brown seed mostly buried in dark soil, only the top peeking out. No green. The chosen species only appears from Sprout stage onward (this makes Day 4 an earned moment).
- Stage changes animate part-by-part with spring physics (`stiffness 80, damping 14`): stem/trunk first, then leaves unfurl staggered, then bud/flower/accent. The sun glow pulses +25% once on any stage change (and once on the onboarding reveal).
- `prefers-reduced-motion` skips all springs/pulses and renders final states.

**Known divergence from the original spec:** the reflections-driven *vitality* visual (leaf saturation deepening + roots appearing with reflections) lives in the older `GrowthVisual` component, which is now used ONLY in the check-in No-confirmation (the roots-growing animation). The Home plant no longer visually encodes reflections beyond the numeric "Reflections" stat card — it encodes species + streak-stage instead. Re-uniting reflections-vitality with the new per-species art is a future task (would need per-stage vitality variants per species).

## What's coming next (Phase 2 — AI layer, not built yet)

- Real AI integration in check-ins (using Anthropic API)
- AI remembers past reflections and gently references them
- After 5+ reflections, unlock a "Patterns" view on Home that surfaces insights ("You skip most often on Sundays")
- AI scores reflection quality (depth, not feelings) — higher quality reflections give more vitality

## What's coming after that (Phase 3+)

- ~~Onboarding flow~~ — ✅ BUILT (7-step flow with localStorage persistence)
- User **accounts + cloud** storage — currently persisted to `localStorage` (single browser, single user; survives refresh but not device changes / clearing storage). Real accounts + sync still to do.
- Push notifications / daily reminders
- Monetization (TBD — likely tied to AI insight depth, premium reflection features, plant cosmetics)
- Reunite reflections-driven vitality with the new per-species stage art (see plant-system divergence note)
- Extend premium per-stage art beyond the 4 species if more living things are added

## Tech stack

- React + Vite + TypeScript
- shadcn/ui
- Tailwind CSS
- Deployed on Vercel (auto-deploys from main branch on GitHub)
- GitHub repo: abhinavyeruva-coder/Nurture-App
- Live URL: https://nurture-app-eight.vercel.app

## User testing feedback (collected 6/25/2026)

- 5 testers; all understood the concept instantly without explanation (positive — visual design carries the meaning)
- Tester quote: "There has to be a number telling me how far along I am to growing my plant" — led to growth stages feature
- Some testers framed it as a procrastination app, not reflection — note that the reflection identity may need to be more visually prominent later

## Founder notes

- Founder is Abhi, a 10th-grade student building this with Claude Code
- Communication style: direct, casual, peer-to-peer
- Founder is design-conscious and pushes back on bad logic — engage with reasoning, not just compliance
- Build philosophy: ship the visible layer first, test with real users, then layer in invisible/AI features

## Code map (where things live)

- `src/App.tsx` — **profile-driven** top-level router. Loads the `UserProfile` from localStorage on first render; if none → renders `OnboardingFlow`, else routes `home` / `checkin` / `log`. Holds the `intro` flag for the one-time onboarding→Home reveal. `handleCompleteCheckIn` updates streak/longest/reflections + appends to `checkIns[]` and saves. `stageFromStreak()` maps streak → growth stage. All screens crossfade in one `AnimatePresence` so onboarding → Home is continuous.
- `src/lib/profile.ts` — `UserProfile` type + `PlantType`, and `loadProfile` / `saveProfile` / `createProfile`. localStorage key is **`nurture_user`** (JSON). `loadProfile` validates shape and returns null on missing/corrupt.
- `src/components/OnboardingFlow.tsx` — the 7-step flow (slide/spring transitions, progress dots for steps 2–6, per-step validation). Contains `PlantingMoment` (Screen 7): seed drops with a spring + buries (soft easeOut), then the personalized message + "Start growing".
- `src/components/AppFrame.tsx` — the single mobile shell (≤420px, centered, ambient blobs). Does NOT handle safe-area padding (see gotcha below).
- `src/components/HomeScreen.tsx` — header, plant card (`PlantVisual`, stage label + progress), 3 stat cards (Streak / Reflections / Longest), log link, check-in CTA. New users (streak 0) get "Seed — Day 1 of your journey" + 0% bar; ≥1 uses normal stage logic + `stageProgress`. The `reveal()` helper drives the spring-staggered onboarding entrance.
- `src/components/PlantVisual.tsx` — the Home plant renderer. Routes `type` + `stage` to the premium scene, swaps only the plant on stage change (pot/glow stay put), and drives the sun-glow pulse (on stage change + once on the onboarding reveal). Takes `animateIn` (reveal) + `reducedMotion`.
- `src/components/PlantArt.tsx` — **the premium illustration system.** Shared `PlantDefs` (all gradients + soft-shadow filters), `PremiumPot`, `GroundShadow`, `PLANT_GLOW`. Shared `SeedStage` (buried seed). Per-species stage bodies (`FlowerStage` / `SucculentStage` / `HerbStage` / `TreeStage`) built from shared `Stem`/`Leaf`/`Pop` spring helpers. `PlantStageBody` routes type+stage; `PlantScene` composes a full static scene (used by the picker); `PlantArt` is the picker cell (renders each species at flowering). Shared viewBox `0 0 64 66`, oklch palette.
- `src/components/CheckInScreen.tsx` — the Yes/No branching check-in. `YES_COPY` / `NO_COPY` objects hold all per-branch question + confirmation copy. Uses `GrowthVisual` for the confirmation plant (+ roots animation on No).
- `src/components/GrowthLogScreen.tsx` — monthly calendar + day-detail view; reads the profile's real `checkIns`.
- `src/components/GrowthVisual.tsx` — the OLDER SVG plant (viewBox 240×250), now used ONLY in the check-in confirmation. Props: `stage`, `reflections` (leaf richness + root depth), `animateRoots` (roots growing on the No confirmation), `wilting`. This is where reflections-vitality still lives (see plant-system divergence note).
- `src/lib/checkins.ts` — `CheckInRecord` type, date helpers (`toDateKey` / `fromDateKey`), and `TODAY` (now the real `new Date()`). `MOCK_CHECKINS` (a sample June 2026 month) is retained for demos but no longer wired into the app.

## Implementation notes & gotchas (read before touching layout)

- **Safe-area padding lives at SCREEN level, never as a stacked wrapper.** Each screen root uses `pt-[max(env(safe-area-inset-top),28px)]` ON its own `min-h-screen` box (border-box, so the inset is absorbed inside the 100vh). Do NOT add a separate padded wrapper around a `min-h-screen` element — that stacks `inset + 100vh > 100vh`, which caused a desktop scrollbar and knocked the frame off-center. This bug was diagnosed and fixed; don't reintroduce it.
- `index.html` viewport meta must keep `viewport-fit=cover` or iOS reports `env(safe-area-inset-top)` as 0.
- The 5th growth stage is named `flowering` in code (not "flourishing").
- Reflections counter increments on ANY check-in with written text (Yes or No); only Yes increments the streak.
- **State persists in `localStorage` under `nurture_user`** (single browser/user). Survives refresh; clearing storage resets to onboarding. Real accounts/cloud sync is still Phase 3.
- **Premium plant art (`PlantArt.tsx`) — all species share the same pot, soil, sun glow, grounding shadow, and shadow filters.** Only the plant on top differs. Never give one species a different pot. Seed stage is shared and identical across species. Add new stage art via the `Stem`/`Leaf`/`Pop` helpers so entrances stay consistent (spring `stiffness 80, damping 14`, staggered stem → leaves → accent).
- SVG filter `flood-color` uses hex (feDropShadow); gradient stops use oklch. SVG shape-scale animations use `transformBox: "fill-box"` + `transformOrigin` so parts grow from their base.
- Onboarding → Home is ONE continuous moment: the planting seed and the Home seed match (both buried), the reveal springs the card in with a slight overshoot, staggers the rest, and pulses the glow once. All motion is gated behind `prefers-reduced-motion`.
- `motion/react` is the import (not `framer-motion`). `GrowthVisual` roots still "grow" via SVG `pathLength` animation.

## Build / deploy

- `npm run build` runs `tsc -b && vite build` — a TS error fails the Vercel build. Type-check locally before pushing.
- Pushing to `main` auto-deploys via Vercel. `.claude/settings.local.json` is local-only — keep it out of commits.
