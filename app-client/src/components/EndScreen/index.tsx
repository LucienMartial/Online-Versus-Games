import { useEffect, useState, StrictMode, FC } from "react";
import { GameScene } from "../../game/game";
import { EndGamePlayerState, EndGameState } from "../../../../app-shared/state";
import "./style.scss";

interface EndScreenProps {
  gameScene: GameScene;
  endGameState: EndGameState;
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
      <th>{id}</th>
      <th>{player.deathCounter}</th>
    </tr>
  );
}

function EndScreen({ gameScene, endGameState }: EndScreenProps) {
  const listPlayers = [...Object.entries(endGameState.players)].map(
    ([id, state]) => {
      return <PlayerRow id={id} player={state} himself={id === gameScene.id} />;
    }
  );

  return (
    <StrictMode>
      <>
        <section>
          <h1>{endGameState.victory ? "Victory" : "Defeat"}</h1>
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
      </>
    </StrictMode>
  );
}

export default EndScreen;
