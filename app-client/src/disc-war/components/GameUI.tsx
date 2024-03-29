import { useEffect, useRef, useState } from "react";
import { DiscWarScene } from "../game";
import "./GameUI.css";
import GameKeyboard from "../../components/game/GameKeyboard";

interface GameUIProps {
  gameScene: DiscWarScene;
}

function DiscWarUI({ gameScene }: GameUIProps) {
  const [respawnText, setRespawnText] = useState<string | undefined>();
  const [shieldText, setShieldText] = useState<string | undefined>();
  const [isRespawning, setIsRespawning] = useState(false);
  const [score, setScore] = useState([0, 0]);

  const leftButton = useRef<HTMLButtonElement>(null);
  const rightButton = useRef<HTMLButtonElement>(null);
  const upButton = useRef<HTMLButtonElement>(null);
  const downButton = useRef<HTMLButtonElement>(null);
  const dashButton = useRef<HTMLButtonElement>(null);
  const counterButton = useRef<HTMLButtonElement>(null);
  const curveButton = useRef<HTMLButtonElement>(null);

  const screenIsTouchable = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  // respawn
  gameScene.gameEngine.respawnTimer.onActive = (
    ticks: number,
    duration: number,
  ) => {
    if (ticks === (duration / 4) * 2) setRespawnText("2");
    else if (ticks === (duration / 4) * 3) setRespawnText("1");
    if (gameScene.lastState?.respawnTimer.active) setIsRespawning(true);
  };

  gameScene.gameEngine.respawnTimer.onInactive = () => {
    if (!gameScene.lastState?.respawnTimer.active) setIsRespawning(false);
  };

  // when respawning, show score
  useEffect(() => {
    // end of respawn
    if (!isRespawning) {
      setRespawnText(undefined);
      return;
    }
    setRespawnText("3");
    setScore([gameScene.gameEngine.leftScore, gameScene.gameEngine.rightScore]);
  }, [isRespawning]);

  // shield
  gameScene.mainPlayer.counterCooldownTimer.onActive = (
    ticks: number,
    duration: number,
  ) => {
    if (ticks <= duration / 3) setShieldText("3");
    else if (ticks <= (duration / 3) * 2) setShieldText("2");
    else setShieldText("1");
  };
  gameScene.mainPlayer.counterTimer.onInactive = () => {
    setShieldText(undefined);
  };

  useEffect(() => {
    gameScene.inputManager.feedInputButtons({
      left: leftButton.current!,
      right: rightButton.current!,
      up: upButton.current!,
      down: downButton.current!,
      space: dashButton.current!,
      shift: counterButton.current!,
      rightClick: curveButton.current!,
    });
  }, []);

  return (
    <>
      {shieldText && <p id="counter">Shield in {shieldText}</p>}
      {isRespawning && (
        <div className="score-wrapper">
          <p className="score" id="score-left">
            {score[0]}
          </p>
          <p id="respawn">{respawnText}</p>
          <p className="score" id="score-right">
            {" "}
            {score[1]}
          </p>
        </div>
      )}
      {screenIsTouchable && (
        <div id="keyboard">
          <GameKeyboard
            leftButton={leftButton}
            rightButton={rightButton}
            upButton={upButton}
            downButton={downButton}
            dashButton={dashButton}
            counterButton={counterButton}
            curveButton={curveButton}
          />
        </div>
      )}
    </>
  );
}

export default DiscWarUI;
