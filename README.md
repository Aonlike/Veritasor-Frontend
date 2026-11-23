# Veritasor Frontend

Business dashboard for the Veritasor revenue attestation protocol. Connect revenue sources, trigger attestations, and view on-chain proof history.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for build and dev server
- **React Router** for navigation

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev
```

The dev server proxies `/api` to `http://localhost:3000` (backend). Start the backend for full functionality.

## Attestation status updates

The attestations page listens for server-sent events at `GET /api/attestations/events`. Each event is JSON with an
`id`, `attestationId`, and `status` (`pending`, `collecting`, `verifying`, `building_merkle_root`, `publishing`,
`verified`, `failed`, or `canceled`); `step`, `message`, and `timestamp` are optional. Reconnection includes the last
received event id as the `lastEventId` query parameter.

If the event stream is unavailable, the frontend polls `GET /api/attestations/status`, passing the last received id as
the `since` query parameter. The response is either an array of status events or an object with an `updates` array.
Streaming and polling pause while offline and resume when connectivity returns.

## Scripts

| Command   | Description              |
|----------|--------------------------|
| `npm run dev`    | Start Vite dev server   |
| `npm run build`  | Production build        |
| `npm run preview`| Preview production build|
| `npm run lint`   | Run ESLint              |

## Project structure

```
veritasor-frontend/
├── src/
│   ├── components/   # Layout, shared UI
│   ├── pages/        # Dashboard, Attestations
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Environment

Create `.env` (optional) for API base URL override:

```
VITE_API_URL=http://localhost:3000
```

## Merging to remote

This directory is a separate git repository. To push to your remote:

```bash
git remote add origin <your-frontend-repo-url>
git push -u origin main
```
