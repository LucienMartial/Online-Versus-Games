import AppButton from "../lib/AppButton";
import { Client } from "colyseus.js";
import { useCallback, useEffect, useState } from "react";
import { Room } from "colyseus.js";
import gameInfosType from "../../types/gameInfosType";

interface GameProps {
  tryConnection: (reservation: any) => Promise<void>;
  gameData: gameInfosType;
  nbClients: number;
  client: Client | undefined;
}

function GameQueue({ client, gameData, tryConnection, nbClients }: GameProps) {
  const [queueRoom, setQueueRoom] = useState<Room>();

  const connectToQueue = useCallback(async () => {
    if (!client) return;
    try {
      const room = await client.joinOrCreate("queue", { game: gameData.id });
      setQueueRoom(room);
      console.log("sucessfuly joined queue room");
    } catch (e) {
      if (e instanceof Error) {
        console.error("Could not connect to queue", e.message);
      }
      return;
    }
  }, [client]);

  const leaveQueue = useCallback(async () => {
    if (!queueRoom) return;
    queueRoom.leave();
    setQueueRoom(undefined);
  }, [queueRoom]);

  useEffect(() => {
    if (!client || !queueRoom) return;
    queueRoom.removeAllListeners();

    // reservation for game
    queueRoom.onMessage("game-found", async (reservation: any) => {
      tryConnection(reservation);
    });

    queueRoom.onLeave(() => {
      leaveQueue();
    });

    return () => {
      leaveQueue();
    };
  }, [queueRoom]);

  return (
    <section className="grow">
      <h1 className="text-3xl">{gameData.name}</h1>
      <p>{gameData.description}</p>
      {
      gameData.keybinds.map((keybinding) => (
        <p key={keybinding.key}>
          {keybinding.key}: {keybinding.description}
        </p>
      ))}

      {!queueRoom && (
        <AppButton color="regular" onClick={connectToQueue}>
          Play
        </AppButton>
      )}
      {queueRoom && (
        <section>
          <p>Searching for a game...</p>
          <AppButton color="regular" onClick={leaveQueue}>
            Leave
          </AppButton>
        </section>
      )}
      <p>In queue: {nbClients}</p>
    </section>
  );
}

export default GameQueue;
