# Sociali

Single-tab social media super app prototype built with Next.js 14, Tailwind CSS, Framer Motion, and Lucide React.

## Run locally

```bash
npm install
npm run dev
```

## Loop 1 production slice (implemented)

- Added a server API endpoint for Pulse feed:
  - `GET /api/pulse/posts`
  - `POST /api/pulse/posts`
- Replaced Pulse mock-only local feed initialization with API-backed loading and publishing.
- Added basic request hardening for post creation:
  - payload validation + sanitization
  - lightweight per-IP in-memory rate limiting
- Added persistent feed storage at `data/pulse-posts.json` (file-based, dev-focused).

## Current architecture direction

- UI remains Next.js App Router with mode-based views.
- Pulse now follows a real client/server flow (client fetch → API route → storage).
- Additional modules (Connect, Vibe, Watch, Circle) are still UI-first and next in iterative migration loops.
