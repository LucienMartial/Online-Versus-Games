import AppButton from "../lib/AppButton";
import { RoomAvailable } from "colyseus.js";

interface GameProps {
  tryConnection: () => Promise<void>;
  gameRooms: RoomAvailable[] | undefined;
}

function GameList({ tryConnection, gameRooms }: GameProps) {
  console.log(gameRooms);
  return (
    <section className="grow">
      <h1>Game</h1>
      <AppButton color={"regular"} onClick={() => tryConnection()}>
        Play
      </AppButton>
      <ul>
        {gameRooms?.map((room) => {
          return (
            <li key={room.roomId}>
              <p>
                {room.roomId} + {room.name}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default GameList;
