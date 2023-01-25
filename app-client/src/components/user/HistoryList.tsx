import {Game} from "../../../../app-shared/types";
import HistoryEntry from "./HistoryEntry";

interface HistoryListProps {
  games: Game[];
}

export default function HistoryList({games}: HistoryListProps) {

  function renderGames(){
    return games.map((game) => {
      return <HistoryEntry timestamp={game.timestamp} player1={game.players[0]} player2={game.players[1]}/>
    })
  }
  return (
        <ul className={"flex flex-col w-fit mx-auto max-h-96 overflow-auto rounded"}>
          {renderGames()}
        </ul>
  )
}