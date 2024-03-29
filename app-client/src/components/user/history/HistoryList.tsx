import { DiscWarStats } from "../../../../../app-shared/disc-war/types";
import { Game } from "../../../../../app-shared/types";
import HistoryEntry from "./HistoryEntry";

interface HistoryListProps {
  games: Game<DiscWarStats>[];
  username: string;
}

export default function HistoryList({ games, username }: HistoryListProps) {
  function renderGames() {
    return games.map((game) => {
      return (
        <HistoryEntry
          key={game.timestamp.toString()}
          username={username}
          game={game}
        />
      );
    });
  }
  return (
    <ul
      className={"flex flex-col w-screen min-h-0 max-h-full overflow-auto text-slate-200"}
    >
      {renderGames()}
    </ul>
  );
}
