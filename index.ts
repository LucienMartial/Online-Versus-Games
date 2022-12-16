import express from "express";
import http from "http";
import { Server } from "socket.io";

import { hello } from "./app-shared/hello.js";
hello();

// express app
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.static("dist"));
app.get("/", (req, res) => {
  res.sendFile("index.html");
});

import apiRouter from "./app-server/api.js";
app.use(apiRouter);

// game server
const io = new Server(server);
import gameServer from "./app-server/game-server.js";
gameServer(io);

server.listen(port, () => {
  console.log(`local: http://localhost:${port}`);
});

export { app };
