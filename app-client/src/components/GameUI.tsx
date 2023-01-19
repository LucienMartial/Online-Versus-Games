import { useEffect, useState } from "react";
import { GameScene } from "../game/game";
import "./GameUI.css";

interface GameUIProps {
  gameScene: GameScene;
}

function GameUI({ gameScene }: GameUIProps) {
  const [respawnText, setRespawnText] = useState<string | undefined>();
  const [shieldText, setShieldText] = useState<string | undefined>();
  const [isRespawning, setIsRespawning] = useState(true);
  const [score, setScore] = useState([0, 0]);

  // respawn
  gameScene.gameEngine.respawnTimer.onActive = (
    ticks: number,
    duration: number
  ) => {
    if (ticks === duration / 4) setRespawnText("3");
    else if (ticks === (duration / 4) * 2) setRespawnText("2");
    else if (ticks === (duration / 4) * 3) setRespawnText("1");
    if (gameScene.lastState?.respawnTimer.active) setIsRespawning(true);
  };

  gameScene.gameEngine.respawnTimer.onInactive = (ticks: number) => {
    setRespawnText(undefined);
    if (!gameScene.lastState?.respawnTimer.active) setIsRespawning(false);
  };

  // when respawning, show score
  useEffect(() => {
    if (!isRespawning) return;
    setScore([gameScene.gameEngine.leftScore, gameScene.gameEngine.rightScore]);
  }, [isRespawning]);

  // shield
  gameScene.mainPlayer.counterCooldownTimer.onActive = (
    ticks: number,
    duration: number
  ) => {
    if (ticks <= duration / 3) setShieldText("3");
    else if (ticks <= (duration / 3) * 2) setShieldText("2");
    else setShieldText("1");
  };
  gameScene.mainPlayer.counterTimer.onInactive = () => {
    setShieldText(undefined);
  };

  return (
    <>
      {respawnText && <h2 id="respawn">{respawnText}</h2>}
      {shieldText && <p id="counter">Shield in {shieldText}</p>}
      {!isRespawning && (
        <div className="score-wrapper">
          <p className="score" id="score-left">
            {score[0]}
          </p>
          <p className="score" id="score-right">
            {" "}
            {score[1]}
          </p>
        </div>
      )}
      {/* <p id="test">Hello from GUI</p> */}
    </>
  );
}

export default GameUI;
