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

// database
import { Database } from "./app-server/database/database.js";

const db = new Database();
await db.connect();
console.log("connected to database");

process.on("exit", () => {
  db.close().then(() => console.log("disconnected from database"));
});

// express app
const cookieKeys = [process.env.COOKIE_KEY_1, process.env.COOKIE_KEY_2];
const { app, session } = createApp(cookieKeys, __dirname, db);
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
import { createApp } from "./app-server/app.js";
import { GameRoom } from "./app-server/rooms/game-room.js";
import { ChatRoom } from "./app-server/rooms/chat-room.js";
import SocialRoom from "./app-server/rooms/social-room.js";

gameServer.define("game", GameRoom, {
  dbCreateGame: db.createGame,
  dbGetProfile: db.getProfile,
  dbUpdateProfile: db.updateProfile,
});
gameServer.define("social", SocialRoom);
gameServer.define("chat-room", ChatRoom);

server.listen(port, () => {
  console.log(`local: http://localhost:${port}`);
});
