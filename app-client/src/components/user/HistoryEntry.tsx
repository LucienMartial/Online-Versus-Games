import { Game } from "../../../../app-shared/types";

interface HistoryEntryProps {
  game: Game;
  username: string;
}

export default function HistoryEntry({ game, username }: HistoryEntryProps) {
  const player1 = game.players[0];
  const player2 = game.players[1];
  const date = new Date(game.timestamp);
  const won =
    (player1.username === username && player1.victory) ||
    (player2.username === username && player2.victory);

  return (
    <li
      className={`text-2xl flex flex-col px-2 bg-slate-500 border-b-2 last:border-b-0 border-slate-700 ${
        won ? "bg-green-900" : "bg-red-900"
      }`}
    >
      <span className={"border-b border-slate-400"}>
        {date.toDateString() +
          " - " +
          date.getHours() +
          ":" +
          date.getMinutes()}
      </span>
      <div className={"grid grid-cols-5 sm:gap-20"}>
        <span className={"text-left"}>{player1.username}</span>
        <span>{player1.deaths}</span>-<span>{player2.deaths}</span>
        <span className={"text-right"}>{player2.username}</span>
      </div>
    </li>
  );
}
