const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const crypto = require("crypto");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));
app.get("/health", (_req, res) => res.json({ ok: true }));

const players = new Map();
const WORLD = { w: 1800, h: 1200 };
const COLORS = ["#56d6ff", "#ffbd4a", "#c28bff", "#6ee7a8", "#ff7b91", "#f4e66a"];

function send(ws, data) {
  if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
}
function broadcast(data) {
  const msg = JSON.stringify(data);
  for (const p of players.values()) if (p.ws.readyState === WebSocket.OPEN) p.ws.send(msg);
}
function safeName(value) {
  return String(value || "Pelaaja").replace(/[<>]/g, "").trim().slice(0, 16) || "Pelaaja";
}
wss.on("connection", (ws) => {
  const id = crypto.randomUUID().slice(0, 8);
  const n = players.size;
  const p = {
    id, ws, name: "Pelaaja", x: 160 + Math.random() * 1500,
    y: 130 + Math.random() * 940, angle: 0, hp: 100,
    color: COLORS[n % COLORS.length], kills: 0, lastShot: 0
  };
  players.set(id, p);
  send(ws, { type: "welcome", id, world: WORLD, players: [...players.values()].map(publicPlayer) });
  broadcast({ type: "joined", player: publicPlayer(p) });

  ws.on("message", (raw) => {
    let m;
    try { m = JSON.parse(raw.toString()); } catch { return; }
    if (m.type === "name") p.name = safeName(m.name);
    if (m.type === "move") {
      p.x = Math.max(24, Math.min(WORLD.w - 24, Number(m.x) || p.x));
      p.y = Math.max(24, Math.min(WORLD.h - 24, Number(m.y) || p.y));
      p.angle = Number(m.angle) || 0;
    }
    if (m.type === "shoot") {
      const now = Date.now();
      if (now - p.lastShot < 170) return;
      p.lastShot = now;
      const target = players.get(String(m.target || ""));
      if (!target || target.id === p.id || target.hp <= 0) return;
      const distance = Math.hypot(target.x - p.x, target.y - p.y);
      if (distance > 650) return;
      target.hp = Math.max(0, target.hp - 34);
      if (target.hp === 0) {
        p.kills++;
        setTimeout(() => {
          if (players.has(target.id)) {
            target.hp = 100;
            target.x = 100 + Math.random() * (WORLD.w - 200);
            target.y = 100 + Math.random() * (WORLD.h - 200);
            send(target.ws, { type: "respawn" });
          }
        }, 2500);
      }
      broadcast({ type: "hit", shooter: p.id, target: target.id, hp: target.hp, kills: p.kills });
    }
  });
  ws.on("close", () => {
    players.delete(id);
    broadcast({ type: "left", id });
  });
});
function publicPlayer(p) {
  return { id: p.id, name: p.name, x: p.x, y: p.y, angle: p.angle, hp: p.hp, color: p.color, kills: p.kills };
}
setInterval(() => {
  broadcast({ type: "state", players: [...players.values()].map(publicPlayer) });
}, 50);

server.listen(PORT, "0.0.0.0", () => console.log(`Battle Royale Online running on ${PORT}`));
