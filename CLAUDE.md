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

- **Home screen** — Welcome header, plant card with growth stage + days until next stage, vitality progress bar, streak card + reflections card, link to Growth Log, check-in CTA
- **Daily Check-in** — Branches based on Yes/No answer, one question per screen, soft transitions
  - Yes flow: "How did it feel?" / "What helped you show up today?"
  - No flow: "What got in the way?" / "What would make tomorrow different?"
  - Yes confirmation: "Your plant has been watered. See you tomorrow."
  - No confirmation: "Honesty is its own kind of growth."
  - Yes increments streak. No does NOT increment streak. Both count toward Reflections counter if user wrote a response.
- **Growth Log** — Monthly calendar view with green dots for Yes days, soft red for No days, neutral for empty. Today has a subtle ring. Tapping a checked-in day opens a detail view with both reflections. Legend: green = "Showed up", red = "Reflected".

## The plant system

Plant SIZE / STAGE is driven by streak:

- Seed: Days 1-3
- Sprout: Days 4-7
- Sapling: Days 8-14
- Budding: Days 15-30
- Flowering: Day 31+

Plant VITALITY is driven by total reflections (both Yes and No reflections count equally):

- Leaf color saturation increases with reflections
- Roots appear and deepen with reflections (none at 0, faint at 3+, visible at 7+, deep at 15+)
- Smooth gradual transitions

Healthiest plant = long streak + many reflections. A streak-only user has a tall but pale plant. A reflections-only user has a small but vibrant plant with deep roots.

## What's coming next (Phase 2 — AI layer, not built yet)

- Real AI integration in check-ins (using Anthropic API)
- AI remembers past reflections and gently references them
- After 5+ reflections, unlock a "Patterns" view on Home that surfaces insights ("You skip most often on Sundays")
- AI scores reflection quality (depth, not feelings) — higher quality reflections give more vitality

## What's coming after that (Phase 3+)

- Onboarding flow (set your habit, pick your living thing)
- User accounts + cloud storage (currently local state only — data resets on refresh)
- Push notifications / daily reminders
- Monetization (TBD — likely tied to AI insight depth, premium reflection features, plant cosmetics)

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
