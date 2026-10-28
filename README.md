# Sky Vanguard

**Multiplayer 3D Fighter Jet Combat** with a significantly improved flight model.

Built as a better version of the original Fighter Jet War game.

## Features

- **Improved flight model**: velocity-based physics with thrust, approximate lift, drag, stall behavior, energy management, and afterburner
- **Solo vs AI** wave-based combat
- **WebSocket multiplayer** (lobby + real-time position / orientation sync)
- Polished HUD, radar, lock-on missiles, guns, particles, procedural audio
- Mobile touch controls
- Three camera views

## Quick Start (Solo)

Just open `index.html` in a modern browser (or deploy the folder to any static host).

## Multiplayer

1. Install dependencies and start the server:

```bash
npm install
npm start
```

Server runs on port `8080` by default.

2. Open `index.html` (or your Vercel deployment).
3. Choose **Multiplayer (WebSocket)**, enter the same Room Code as other players, and click TAKEOFF.

For production, deploy `server.mjs` to any Node host (Railway, Fly.io, Render, a VPS, etc.) and update the `WS_URL` in `index.html`.

## Controls

| Key | Action |
|-----|--------|
| W / S | Pitch |
| A / D | Roll |
| Q / E | Yaw |
| Shift | Afterburner |
| Space | Guns |
| F | Fire missile |
| C | Cycle camera |
| R | Cycle lock target |

## Deploy

- **Static frontend** → Vercel / Netlify / GitHub Pages (just the `index.html`)
- **Multiplayer server** → any Node.js host that supports WebSockets

## Tech

- Three.js (r160)
- Vanilla JS
- WebSocket (`ws` package for the server)
- Web Audio API (procedural engine + SFX)
