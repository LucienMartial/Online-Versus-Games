import AppButton from "../lib/AppButton";
import { Client, RoomAvailable } from "colyseus.js";
import { useCallback, useEffect, useState } from "react";
import { Room } from "colyseus.js";

interface GameProps {
  tryConnection: () => Promise<void>;
  nbClients: number;
  client: Client | undefined;
}

function GameQueue({ client, tryConnection, nbClients }: GameProps) {
  const [queueRoom, setQueueRoom] = useState<Room>();

  const connectToQueue = useCallback(async () => {
    if (!client) return;
    try {
      const room = await client.joinOrCreate("queue");
      setQueueRoom(room);
      console.log("sucessfuly joined queue room");
    } catch (e) {
      if (e instanceof Error)
        console.error("Could not connect to queue", e.message);
      return;
    }
    return () => {
      queueRoom?.leave();
    };
  }, [client]);

  const leaveQueue = useCallback(async () => {
    if (!queueRoom) return;
    queueRoom.leave();
    setQueueRoom(undefined);
  }, [queueRoom]);

  useEffect(() => {
    if (!queueRoom) return;
    queueRoom.removeAllListeners();
  }, [queueRoom]);

  return (
    <section className="grow">
      <h1>Game</h1>
      {!queueRoom ? (
        <AppButton color="regular" onClick={connectToQueue}>
          Play
        </AppButton>
      ) : (
        <AppButton color="regular" onClick={leaveQueue}>
          Leave
        </AppButton>
      )}
      <p>{nbClients}</p>
    </section>
  );
}

export default GameQueue;
