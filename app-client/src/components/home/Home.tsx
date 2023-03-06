import { StrictMode, useCallback, useEffect, useState } from "react";
import FriendList from "./friends-list/FriendList";
import { Client } from "colyseus.js";
import { Room } from "colyseus.js";
import GameQueue from "./GameQueue";
import gamesInfos from "../../data/games-infos";

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
  const [queueRoom, setQueueRoom] = useState<Room>();

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

  return (
    <StrictMode>
      <main className="flex grow flex-col-reverse sm:flex-row gap-2">
        <section className="grow px-3 flex flex-row flex-wrap gap-3">
          {gamesInfos.map((gameInfo) => (
            <GameQueue
              key={gameInfo.name}
              gameData={gameInfo}
              setQueueRoom={setQueueRoom}
              queueRoom={queueRoom}
              tryConnection={tryConnection}
              lobbyRoom={lobbyRoom}
              client={client}
            />
          ))}
        </section>
        <FriendList client={client} />
      </main>
    </StrictMode>
  );
}

export default Home;
