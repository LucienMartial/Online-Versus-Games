import { DiscWarStats } from "../../../../../app-shared/disc-war/types";
import { Game } from "../../../../../app-shared/types";

interface HistoryEntryProps {
  game: Game<DiscWarStats>;
  username: string;
}

export default function HistoryEntry({ game, username }: HistoryEntryProps) {
  const player1 = game.players[0];
  const player2 = game.players[1];
  const date = new Date(game.timestamp);
  const won = (player1.username === username && player1.victory) ||
    (player2.username === username && player2.victory);

  return (
    <li
      className={`text-2xl flex flex-col p-2 border-b-2 last:border-b-0 border-gray-400 ${
        won ? "bg-green-800" : "bg-red-800"
      } bg-opacity-80 backdrop-blur-md`}
    >
      <span className={""}>
        {date.toDateString() +
          " - " +
          date.getHours() +
          ":" +
          date.getMinutes()}
      </span>
      <div className={"grid grid-cols-5 sm:gap-20"}>
        <span className={"text-left"}>{player1.username}</span>
        <span>{player1.stats.deaths}</span>-<span>{player2.stats.deaths}</span>
        <span className={"text-right"}>{player2.username}</span>
      </div>
    </li>
  );
}
