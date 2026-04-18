# Sociali

Sociali is now backed by a real server-side API for core platform foundations, including:

- Session auth (register/login/logout/session)
- Persistent backend storage for Pulse feed data
- API-driven Pulse timeline with pagination
- Auth-gated posting and reactions (like/repost/bookmark)
- Input validation and basic per-IP rate limiting for auth routes

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Included API routes

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/session`
- `GET /api/pulse/posts?limit=10&cursor=<postId>`
- `POST /api/pulse/posts`
- `POST /api/pulse/posts/:id/reactions`

## Local persistence

Data is stored in:

- `/home/runner/work/Sociali/Sociali/data/sociali-db.json`

A default local development account is auto-seeded:

- username: `indoairevo`
- password: `sociali-dev-password`

You can also register new users directly from the Pulse tab UI.

## Current scope of this implementation

This update implements the first production foundation slice:

- backend service boundaries and API layer
- identity/session baseline
- persistent data flow migration for the Pulse tab

Other surfaces (Connect, Vibe, Watch, Circle) remain UI-only and can be migrated next using the same service/API architecture.
