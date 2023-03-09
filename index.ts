import http from "http";
import { LobbyRoom, Server } from "colyseus";
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
  // simulate 80ms latency between server and client.
  gameServer.simulateLatency(80);
}

// rooms
import { createApp } from "./app-server/app.js";
import { DiscWarRoom } from "./app-server/disc-war/room/discwar-room.js";
import { ChatRoom } from "./app-server/rooms/chat-room.js";
import SocialRoom from "./app-server/rooms/social-room.js";
import QueueRoom from "./app-server/rooms/queue-room.js";
import { DiscWarEngine } from "./app-shared/disc-war/index.js";
import { TagWarEngine } from "./app-shared/tag-war/tag-war.js";
import { TagWarRoom } from "./app-server/tag-war/room/tagwar-room.js";

gameServer.define("social", SocialRoom);
gameServer.define("chat-room", ChatRoom);
gameServer.define("lobby", LobbyRoom);

gameServer.define("disc-war", DiscWarRoom, {
  dbCreateGame: db.discWar.createGame.bind(db.discWar),
  dbGetProfile: db.discWar.getProfile.bind(db.discWar),
  dbUpdateProfile: db.discWar.updateProfile.bind(db.discWar),
  dbGetUserShop: db.getUserShop.bind(db),
  dbAddCoins: db.addCoins.bind(db),
  engine: DiscWarEngine,
});

gameServer.define("tag-war", TagWarRoom, {
  dbCreateGame: db.tagWar.createGame.bind(db.tagWar),
  dbGetProfile: db.tagWar.getProfile.bind(db.tagWar),
  dbUpdateProfile: db.tagWar.updateProfile.bind(db.tagWar),
  dbGetUserShop: db.getUserShop.bind(db),
  dbAddCoins: db.addCoins.bind(db),
  engine: TagWarEngine,
});

gameServer
  .define("queue-disc-war", QueueRoom, { gameName: "disc-war" })
  .enableRealtimeListing();
gameServer
  .define("queue-tag-war", QueueRoom, { gameName: "tag-war" })
  .enableRealtimeListing();

server.listen(port, () => {
  console.log(`local: http://localhost:${port}`);
});
