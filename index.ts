import http from "http";
import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";

// dirname
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// environment
import * as dotenv from "dotenv";
dotenv.config();

import { hello } from "./app-shared/hello.js";
hello();

// database
import { Database } from "./app-server/database/database.js";

const db = new Database();
db.connect().then(() => console.log("connected to database"));
process.on("exit", () => {
  db.close().then(() => console.log("disconnected from database"));
});

// express app
const { app, session } = createApp(__dirname, db);
const port = process.env.PORT || 3000;
const server = http.createServer(app);

// game server
const gameServer = new Server({
  transport: new WebSocketTransport({
    verifyClient: (info, next) => {
      session(info.req as any, {} as any, () => next(true));
    },
    server: server,
  }),
});

if (process.env.NODE_ENV !== "production") {
  // simulate 200ms latency between server and client.
  gameServer.simulateLatency(200);
}

// rooms
import { GameRoom } from "./app-server/game-room.js";
import { createApp } from "./app-server/app.js";
gameServer.define("game", GameRoom);

server.listen(port, () => {
  console.log(`local: http://localhost:${port}`);
});
