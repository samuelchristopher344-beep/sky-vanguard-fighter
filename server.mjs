// Simple WebSocket multiplayer server for Sky Vanguard
// Run: node server.mjs
// Then point the client WebSocket URL to ws://localhost:8080 (or your deployed URL)

import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = process.env.PORT || 8080;
const rooms = new Map(); // roomCode -> Map<id, playerData>

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Sky Vanguard multiplayer server is running\n');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  let playerId = null;
  let roomCode = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === 'join') {
      playerId = msg.id || Math.random().toString(36).slice(2, 10);
      roomCode = (msg.room || 'WAR1').toUpperCase();
      if (!rooms.has(roomCode)) rooms.set(roomCode, new Map());
      const room = rooms.get(roomCode);
      room.set(playerId, {
        id: playerId,
        name: msg.name || 'Pilot',
        x: 0, y: 900, z: 0,
        qx: 0, qy: 0, qz: 0, qw: 1,
        health: 100, score: 0,
        ws
      });
      console.log(`[${roomCode}] ${msg.name} joined (${room.size} players)`);
      broadcastRoom(roomCode);
      return;
    }

    if (msg.type === 'update' && playerId && roomCode) {
      const room = rooms.get(roomCode);
      if (!room || !room.has(playerId)) return;
      const p = room.get(playerId);
      Object.assign(p, {
        x: msg.x, y: msg.y, z: msg.z,
        qx: msg.qx, qy: msg.qy, qz: msg.qz, qw: msg.qw,
        health: msg.health, score: msg.score,
        name: msg.name || p.name
      });
      if (!p._lastBroadcast || Date.now() - p._lastBroadcast > 50) {
        p._lastBroadcast = Date.now();
        broadcastRoom(roomCode);
      }
    }
  });

  ws.on('close', () => {
    if (roomCode && playerId && rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      room.delete(playerId);
      console.log(`[${roomCode}] player left (${room.size} left)`);
      if (room.size === 0) rooms.delete(roomCode);
      else broadcastRoom(roomCode);
    }
  });
});

function broadcastRoom(code) {
  const room = rooms.get(code);
  if (!room) return;
  const players = [...room.values()].map(p => ({
    id: p.id, name: p.name,
    x: p.x, y: p.y, z: p.z,
    qx: p.qx, qy: p.qy, qz: p.qz, qw: p.qw,
    health: p.health, score: p.score
  }));
  const payload = JSON.stringify({ type: 'state', players });
  for (const p of room.values()) {
    if (p.ws.readyState === 1) p.ws.send(payload);
  }
}

server.listen(PORT, () => {
  console.log(`Sky Vanguard multiplayer server listening on :${PORT}`);
});
