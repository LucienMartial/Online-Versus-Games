import { useEffect, useState, useCallback } from "react";
import { Client, Room } from "colyseus.js";

const COLYSEUS_ENDPOINT =
  process.env.NODE_ENV === "development" ? "ws://localhost:3000" : undefined;
const GAME_NAME = "game";

// connection data are saved on the local storage
// they are retrieved to reconnect to leaved game

const connectionStorage = "game-info";
interface ConnectionData {
  roomId: string;
  sessionId: string;
}

function fetchConnectionData(): ConnectionData {
  const dataString = localStorage.getItem(connectionStorage);
  if (!dataString) throw new Error("empty connection data");
  const data: ConnectionData = JSON.parse(dataString);
  return data;
}

function saveConnectionData(room: Room) {
  const data: ConnectionData = {
    roomId: room.id,
    sessionId: room.sessionId,
  };
  const dataString = JSON.stringify(data);
  localStorage.setItem(connectionStorage, dataString);
}

// hook

function useGameConnect() {
  const [gameRoom, setGameRoom] = useState<Room>();
  const [client, setClient] = useState<Client>();

  // creaate client instance
  useEffect(() => {
    setClient(new Client(COLYSEUS_ENDPOINT));
  }, []);

  // try to reconnect to precedent game
  const tryReconnection = useCallback(async () => {
    if (gameRoom) return;
    if (!client) throw new Error("client is not defined");

    console.log("fetch connection data");
    const data = fetchConnectionData();
    console.log("reconnection with ", data);

    const room = await client.reconnect(data.roomId, data.sessionId);
    setGameRoom(room);
    saveConnectionData(room);
    console.log("reconnected successfuly");
  }, [client]);

  // try to join or create a game
  const tryConnection = useCallback(async () => {
    try {
      if (!client) throw new Error("client is not defined");

      console.log("try to join");
      const room = await client.joinOrCreate(GAME_NAME);

      setGameRoom(room);
      saveConnectionData(room);
      console.log("joined a game successfully");
    } catch (e) {
      console.error("join error", e);
    }
  }, [client]);

  return { gameRoom, client, tryReconnection, tryConnection, setGameRoom };
}

export { useGameConnect };
