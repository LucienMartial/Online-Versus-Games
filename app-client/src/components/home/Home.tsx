import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import FriendList from "./friends-list/FriendList";
import { Client } from "colyseus.js";
import GameList from "./GameList";
import { Room, RoomAvailable } from "colyseus.js";

declare module "colyseus.js" {
  interface RoomAvailable {
    name: string;
  }
}

interface HomeProps {
  tryConnection: () => Promise<void>;
  client: Client | undefined;
}

function Home({ tryConnection, client }: HomeProps) {
  const [lobbyRoom, setLobbyRoom] = useState<Room>();
  const [gameRooms, setGameRooms] = useState<RoomAvailable[]>();

  const connectToLobby = useCallback(async () => {
    if (!client) return;
    try {
      const room = await client.joinOrCreate("lobby");
      setLobbyRoom(room);
    } catch (e) {
      if (e instanceof Error)
        console.error("Could not connect to lobby", e.message);
      return;
    }
  }, [client]);

  useEffect(() => {
    connectToLobby();
    return () => {
      lobbyRoom?.leave();
    };
  }, [client]);

  useEffect(() => {
    if (!lobbyRoom) return;
    lobbyRoom.removeAllListeners();

    lobbyRoom.onMessage("rooms", (rooms: RoomAvailable[]) => {
      setGameRooms(
        rooms.filter((room) => {
          return room.name === "game";
        })
      );
      console.log(rooms.forEach((room) => console.log(room.clients)));
    });

    lobbyRoom.onMessage("+", ([roomId, room]) => {
      console.log("ROOMS", gameRooms);
      if (!gameRooms) return;
      const roomIndex = gameRooms.findIndex((room) => room.roomId === roomId);
      if (roomIndex < 0) return;
      setGameRooms([...gameRooms, room]);
    });

    lobbyRoom.onMessage("-", (roomId) => {
      if (!gameRooms) return;
      setGameRooms(gameRooms.filter((room) => room.roomId !== roomId));
    });
  }, [lobbyRoom]);

  return (
    <StrictMode>
      <main className="flex grow">
        <GameList tryConnection={tryConnection} gameRooms={gameRooms} />
        <FriendList client={client} />
      </main>
    </StrictMode>
  );
}

export default Home;
