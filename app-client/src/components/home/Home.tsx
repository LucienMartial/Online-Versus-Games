import { StrictMode, useCallback, useEffect, useRef, useState } from "react";
import FriendList from "./friends-list/FriendList";
import { Client } from "colyseus.js";
import { Room, RoomAvailable } from "colyseus.js";
import GameQueue from "./GameQueue";
import gamesInfos from "../../data/games-infos";
import gameInfosType from "../../types/gameInfosType";

declare module "colyseus.js" {
  interface RoomAvailable {
    name: string;
  }
}

interface HomeProps {
  tryConnection: (reservation: any) => Promise<void>;
  client: Client | undefined;
}

function Home({ tryConnection, client }: HomeProps) {
  const [lobbyRoom, setLobbyRoom] = useState<Room>();
  const [nbClients, setNbClients] = useState(0);
  let queueRoomId = useRef("");

  const connectToLobby = useCallback(async () => {
    if (!client) return;
    try {
      const room = await client.joinOrCreate("lobby");
      setLobbyRoom(room);
      console.log("sucessfuly joined lobby room");
    } catch (e) {
      if (e instanceof Error) {
        console.error("Could not connect to lobby", e.message);
      }
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
      const queueRoom = rooms.find((room) => room.name === "queue");
      if (!queueRoom) return;
      queueRoomId.current = queueRoom.roomId;
      setNbClients(queueRoom.clients);
    });

    lobbyRoom.onMessage("+", ([roomId, room]) => {
      if (room.name !== "queue") return;
      queueRoomId.current = room.roomId;
      setNbClients(room.clients);
    });

    lobbyRoom.onMessage("-", (roomId) => {
      if (roomId !== queueRoomId.current) return;
      setNbClients(0);
    });
  }, [lobbyRoom]);

  return (
    <StrictMode>
      <main className="flex grow">
        <section className="grow">
          {gamesInfos.map((gameInfo) => (
            <GameQueue
            gameData={gameInfo}
            tryConnection={tryConnection}
            nbClients={nbClients}
            client={client} />
          ))
            }
        </section>
        <FriendList client={client} />
      </main>
    </StrictMode>
  );
}

export default Home;
