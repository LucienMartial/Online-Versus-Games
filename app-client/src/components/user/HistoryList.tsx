import { Game } from "../../../../app-shared/types";
import HistoryEntry from "./HistoryEntry";

interface HistoryListProps {
  games: Game[];
  username: string;
}

export default function HistoryList({ games, username }: HistoryListProps) {
  function renderGames() {
    return games.map((game) => {
      return (
        <HistoryEntry
          key={game.timestamp.toString()}
          timestamp={game.timestamp}
          player1={game.players[0]}
          player2={game.players[1]}
          username={username}
        />
      );
    });
  }
  return (
    <ul
      className={"flex flex-col w-screen min-h-0 max-h-full overflow-auto sm:w-fit mx-auto rounded text-2xl"}
    >
      {renderGames()}
    </ul>
  );
}