import AppButton from "../lib/AppButton";
import { Client, RoomAvailable } from "colyseus.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Room } from "colyseus.js";
import gameInfosType from "../../types/gameInfosType";

interface GameProps {
  tryConnection: (reservation: any) => Promise<void>;
  gameData: gameInfosType;
  lobbyRoom: Room | undefined;
  client: Client | undefined;
  queueRoom: Room | undefined;
  setQueueRoom: (room: Room | undefined) => void;
}

function GameQueue(
  { client, gameData, tryConnection, lobbyRoom, queueRoom, setQueueRoom }:
    GameProps,
) {
  const [nbClients, setNbClients] = useState(0);
  const queueRoomId = useRef("");
  const inQueue = queueRoom?.id === queueRoomId.current;

  const connectToQueue = useCallback(async () => {
    if (!client) return;
    try {
      const room = await client.joinOrCreate(gameData.queueName);
      queueRoomId.current = room.id;
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

    return () => {
      leaveQueue();
    };
  }, [queueRoom]);

  useEffect(() => {
    if (!lobbyRoom) return;

    lobbyRoom.onMessage("rooms", (rooms: RoomAvailable[]) => {
      const queueRoom = rooms.find((room) => room.name === gameData.queueName);
      if (!queueRoom) return;
      queueRoomId.current = queueRoom.roomId;
      setNbClients(queueRoom.clients);
    });

    lobbyRoom.onMessage("+", ([_roomId, room]) => {
      if (room.name !== gameData.queueName) return;
      queueRoomId.current = room.roomId;
      setNbClients(room.clients);
    });

    lobbyRoom.onMessage("-", (roomId) => {
      if (roomId !== queueRoomId.current) return;
      setNbClients(0);
    });
  }, [lobbyRoom]);

  return (
    <section className="w-full sm:w-80 h-fit rounded bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-200 px-2.5 py-2.5">
      <h1 className="text-3xl">{gameData.name}</h1>
      <p>{gameData.description}</p>
      <details className="py-2">
        <summary>Keybinds</summary>
        <div>
          {gameData.keybinds.map((keybinding) => (
            <div
              className="grid grid-cols-2 px-2 even:bg-slate-300 odd:bg-slate-100 dark:even:bg-slate-800 dark:odd:bg-slate-700"
              key={keybinding.key}
            >
              <span className="text-left">{keybinding.key}</span>
              <span className="text-right text-ellipsis overflow-hidden">
                {keybinding.description}
              </span>
            </div>
          ))}
        </div>
      </details>

      {!inQueue && (
        <AppButton
          color="regular"
          onClick={connectToQueue}
          grayedOut={queueRoom ? true : false}
        >
          Play
        </AppButton>
      )}

      {inQueue && (
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
