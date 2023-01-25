import {GamePlayer} from "../../../../app-shared/types";
import {useContext} from "react";
import {UserContext} from "../../App";

interface HistoryEntryProps {
  timestamp: Date;
  player1: GamePlayer
  player2: GamePlayer
}

export default function HistoryEntry({timestamp, player1, player2}: HistoryEntryProps) {
  const username = useContext(UserContext);
  const won = ((player1.username === username && player1.victory) || (player2.username === username && player2.victory));
  const lost = ((player1.username === username && !player1.victory) || (player2.username === username && !player2.victory));
  const date = new Date(timestamp);
  return (
      <li className={`flex flex-col px-2 bg-slate-500 border-b-2 last:border-b-0 border-slate-700 ${won ? "bg-green-900" : ""} ${lost ? "bg-red-900" : ""}`}>
        <span className={"border-b border-slate-400"}>{date.toUTCString()}</span>
        <div className={"flex flex-row justify-between gap-2"}>
        <span>{player1.username}</span>
        <span>{player1.deathCount}</span>
          -
        <span>{player2.deathCount}</span>
        <span>{player2.username}</span>
        </div>
      </li>
  )
}