# CaspyAI

**AI-powered GIS platform for ecological monitoring and emergency response across the Caspian Sea.**

[![Live Demo](https://img.shields.io/badge/Vercel-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://caspy-ai.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/CyberRamazan/CaspyAI)

Built for **Caspian Hackathon 2026** by team **Cyber Nomads**.

---

## Overview

CaspyAI is a situational operations dashboard that combines interactive mapping with AI-assisted emergency reporting. Operators place an incident epicenter on the map, configure environmental parameters, and receive a structured response brief with severity metrics, resource recommendations, and ecology protection steps — localized to the nearest Caspian coastal authority.

## Features

### Interactive map
- Full Caspian Sea view (centered at 42°N, 52°E) with dark Carto basemap
- Click-to-set incident epicenter with hazard zone overlay
- Pre-seeded markers for ports, oil fields, deltas, and sensitive habitats across all five littoral states
- Map flies to epicenter on selection; nearby assets highlighted within 150 km

### Incident simulation
- Three incident types: **oil spill**, **plastic waste**, **fauna threat**
- Configurable radius (km), wind speed, and wind direction
- Deterministic severity scoring and affected area (km²) via `@turf/turf`
- Nearest coastal city and regional authority detected locally (10 cities: Aktau, Atyrau, Astrakhan, Baku, Turkmenbashi, etc.)

### AI emergency reports
- **Streaming operational brief** — Claude writes the narrative as plain text, token by token
- **Structured action lists** — containment resources and seal/ecology protection steps via tool call
- Hybrid pipeline: local metrics (severity, area, region) appear instantly; AI fills narrative and recommendations
- Reports generated in the user's selected language
- Graceful **template fallback** if the API key is missing or the request fails, with a visible notice in the UI
- AI vs template badge on each report

### Localization
- UI and report content in **English**, **Russian**, and **Kazakh**
- Language preference persisted in browser storage

### Access & roles
- Landing page with demo login flow
- Role selection: DCHS operator, ecology inspector, or guest viewer
- Resizable sidebar with incident controls and live report panel

### Live metrics bar
- Active incident count, estimated risk area, Caspian sea level reference (−28.5 m), and ecosystem alert status

---

## Tech stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Framer Motion, Lucide Icons |
| **GIS** | React-Leaflet, Leaflet, `@turf/turf` |
| **AI** | Anthropic Claude API (`@anthropic-ai/sdk`), default model `claude-sonnet-4-5-20250929` |
| **Deployment** | Vercel |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- An [Anthropic API key](https://console.anthropic.com/) for live AI reports

### Installation

```bash
git clone https://github.com/CyberRamazan/CaspyAI.git
cd CaspyAI
npm install
```

### Environment

Copy the example env file and add your API key:

```bash
cp .env.example .env
```

```env
ANTHROPIC_API_KEY=your_key_here

# Optional — override the default Sonnet model
# ANTHROPIC_MODEL=claude-sonnet-4-5-20250929
```

### Seed map markers (optional)

Map markers are stored in `data/caspian-markers.json`. To populate or refresh them via Claude:

```bash
npm run seed:markers
```

This calls the Anthropic API once and writes ~25–35 Caspian assets (ports, fields, habitats) to the JSON file. The app reads this file at runtime through `GET /api/markers` — no client-side discovery.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other scripts

| Command | Description |
| :--- | :--- |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed:markers` | Regenerate `data/caspian-markers.json` |

---

## Architecture

```
User clicks map → epicenter set
                → configure incident (type, radius, wind)
                → Generate Report

POST /api/report (SSE stream)
  ├─ baseline   — severity, area, region (local, instant)
  ├─ text       — operational brief (Claude, streamed)
  ├─ lists      — containment + ecology steps (Claude tool, streamed)
  └─ complete   — final merged report

GET /api/markers — reads data/caspian-markers.json
```

Without a valid `ANTHROPIC_API_KEY`, report generation falls back to deterministic templates in `lib/reportGenerator.ts`.

---

## Project structure

```
app/
  api/report/     SSE streaming report generation
  api/markers/    Serve pre-seeded map markers
  page.tsx        App entry
components/       Dashboard, map, sidebar, auth, i18n UI
data/
  caspian-markers.json   Map marker database
lib/
  caspianRegions.ts      Nearest-city lookup
  reportGenerator.ts     Local metrics + template fallback
  reportStream.ts        Client SSE consumer
scripts/
  seed-markers.mjs       One-shot marker seeding via Claude
```

---

## Production

Live deployment: [https://caspy-ai.vercel.app](https://caspy-ai.vercel.app)

Set `ANTHROPIC_API_KEY` in your Vercel project environment variables for AI reports in production.

---

## Team — Cyber Nomads

| Name | Role |
| :--- | :--- |
| Ramazan Nurbergen | Product Manager |
| Tansholpan Abdipaiyz | DevOps Engineer |
| Bektursyn Zhukeshbayev | Full-stack Developer |
| Assiya Nurbergen | UI/UX Designer & Presenter |
| Milana Yergaliyeva | Product Analyst & Presenter |

*Caspian Hackathon 2026*
