import express from "express";
import cookieSession from "cookie-session";
import http from "http";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";

// environment
import * as dotenv from "dotenv";
dotenv.config();

import { hello } from "./app-shared/hello.js";
hello();

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// express app
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
    maxAge: 10 * 60 * 1000, // 10 minutes
  })
);

app.use(express.json());
app.use(express.static("dist"));
import apiRouter from "./app-server/api/api.js";
app.use("/api", apiRouter);

app.get("/*", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// game server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: server,
  }),
});

if (process.env.NODE_ENV !== "production") {
  // simulate 200ms latency between server and client.
  gameServer.simulateLatency(200);
}

// rooms
import { GameRoom } from "./app-server/game-room.js";
gameServer.define("game", GameRoom);

server.listen(port, () => {
  console.log(`local: http://localhost:${port}`);
});

// database
import { Database } from "./app-server/database/database.js";

const db = new Database();
db.connect().then(() => console.log("connected to database"));

process.on("exit", () => {
  db.close().then(() => console.log("disconnected from database"));
});

export { app, db };
