import { Server } from "socket.io";

const gameServer = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
  });
};

export default gameServer;
