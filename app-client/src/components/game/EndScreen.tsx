import { StrictMode, Dispatch, useCallback } from "react";
import { GameScene } from "../../game/game";
import {
  EndGamePlayerState,
  EndGameState,
  GameState,
} from "../../../../app-shared/state";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { Room } from "colyseus.js";

interface EndScreenProps {
  gameScene: GameScene;
  endGameState: EndGameState;
  setGameRoom: Dispatch<Room<GameState> | undefined>;
}

function PlayerRow({
  id,
  player,
  himself,
}: {
  id: string;
  player: EndGamePlayerState;
  himself: boolean;
}) {
  return (
    <tr className={`player ${himself ? "himself" : ""}`}>
      <th>{player.username}</th>
      <th>{player.deathCounter}</th>
    </tr>
  );
}

function EndScreen({ gameScene, endGameState, setGameRoom }: EndScreenProps) {
  const listPlayers: JSX.Element[] = [];
  let victory = false;
  [...Object.entries(endGameState.players)].forEach(([id, state]) => {
    // current player
    if (id === gameScene.id) {
      victory = state.victory;
    }
    // info for list of players
    listPlayers.push(
      <PlayerRow
        key={id}
        id={id}
        player={state}
        himself={id === gameScene.id}
      />
    );
  });

  const navigate = useNavigate();
  const leaveGame = useCallback(() => {
    navigate("/home");
    setGameRoom(undefined);
  }, []);

  return (
    <StrictMode>
      <main>
        <section>
          <h1>{victory ? "Victory" : "Defeat"}</h1>
          <table>
            <thead>
              <tr>
                <th>Player name</th>
                <th>Death</th>
              </tr>
            </thead>
            <tbody>{listPlayers}</tbody>
          </table>
        </section>
        <button onClick={leaveGame}>Leave</button>
      </main>
    </StrictMode>
  );
}

export default EndScreen;
