import { useState } from "react";
import { GameScene } from "../game/game";
import "./GameUI.css";

interface GameUIProps {
  gameScene: GameScene;
}

function GameUI({ gameScene }: GameUIProps) {
  const [respawnText, setRespawnText] = useState<string | undefined>();

  gameScene.gameEngine.respawnTimer.onActive = (
    ticks: number,
    duration: number
  ) => {
    if (ticks === duration / 4) setRespawnText("3");
    else if (ticks === (duration / 4) * 2) setRespawnText("2");
    else if (ticks === (duration / 4) * 3) setRespawnText("1");
  };

  gameScene.gameEngine.respawnTimer.onInactive = () => {
    setRespawnText(undefined);
  };

  return (
    <>
      {respawnText && <h2 id="respawn">{respawnText}</h2>}
      <p id="test">Hello from GUI</p>
    </>
  );
}

export default GameUI;
