# xedu Student Self-Assessment Tool

A situational self-assessment that builds an abstract portrait of a student through the choices they make across a simulated school day — not through a form.

## The Concept

Traditional self-assessment asks students to describe themselves. This tool puts them *in* six moments from a real school day and watches what they choose. Those choices build a circular abstract portrait in real time, and an AI reads the whole composition to generate a personalised profile.

The result isn't a score. It's an observation.

## Research Basis

**Ecological Momentary Assessment (EMA)**  
Captures behaviour in context rather than relying on retrospective self-report. People systematically misremember and misrepresent their own behaviour — EMA sidesteps this by assessing in the moment of a simulated situation.  
*Shiffman, Stone & Hufford (2008). Ecological Momentary Assessment. Annual Review of Clinical Psychology.*

**Situational Judgment Testing (SJT)**  
Presents realistic scenarios and asks for behavioural choices rather than self-descriptions. SJTs predict real-world performance significantly better than personality questionnaires.  
*McDaniel, Morgeson, Finnegan, Campion & Braverman (2001). Use of situational judgment tests to predict job performance. Journal of Applied Psychology.*

## Running Locally

```bash
npm install
```

Create `.env.local`:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## The 6 Dimensions

| Dimension | Colour | What it measures |
|-----------|--------|-----------------|
| Drive | Purple `#7F77DD` | Motivation under pressure; willingness to push when it's hard |
| Confidence | Green `#1D9E75` | Self-belief in public; willingness to be visibly wrong |
| Consistency | Amber `#EF9F27` | Whether intention translates to action across the day |
| Leadership | Coral `#D85A30` | Moving toward friction; taking responsibility in social situations |
| Extracurricular | Pink `#D4537E` | Structured engagement outside the classroom |
| Self-Awareness | Blue `#378ADD` | Accurate understanding of one's own behaviour and patterns |

## The 6 Archetypes

Detection order matters — first match wins.

1. **The Quiet Strategist** — selfAware >= 4 AND confidence < 2  
   *Thinks before moving. Reads the room. Often mistaken for passive — almost always calculating.*

2. **The Reluctant Leader** — leadership >= 4 AND confidence < 3  
   *Steps up when it matters, then wonders why they always end up responsible.*

3. **The Consistent Builder** — consistency >= 5  
   *Doesn't peak loudly. Just keeps showing up. Quietly formidable over time.*

4. **The Spark Without Follow-Through** — confidence >= 3 AND consistency < 0  
   *Energy, ideas, potential — and a pattern of not finishing what they start.*

5. **The Self-Aware Drifter** — selfAware >= 5 AND consistency < 2  
   *Knows exactly what they're doing and why. Still does it anyway.*

6. **The Grounded Realist** — fallback (always matches)  
   *Clear-eyed about limitations and strengths. Not flashy. Quietly reliable.*

## What We'd Build Next

- **Portrait sharing** — export the abstract circular portrait as a PNG the student can keep
- **Teacher dashboard** — anonymised class-level view showing dimension distributions and archetype spread
- **Longitudinal tracking** — run the same assessment at the start and end of term; show how the portrait changed
- **Scene expansion** — add university/apprenticeship-specific scene sets for post-16 students
- **Counsellor notes** — flag students whose portrait signals specific patterns for pastoral follow-up

## Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict)
- Tailwind CSS
- Anthropic SDK (`@anthropic-ai/sdk`) — Claude powers the final portrait reading and personalised profile generation
