import { StrictMode, useState } from "react";
import { TagWarScene } from "../game";

interface GameUIProps {
  gameScene: TagWarScene;
}

function TagWarUI({ gameScene }: GameUIProps) {
  const [ping, setPing] = useState(gameScene.pingInterval);
  const [fps, setFps] = useState(gameScene.averageFps);

  setInterval(() => {
    setPing(Math.floor(gameScene.pingInterval));
    setFps(Math.floor(gameScene.averageFps));
  }, 200);

  return (<>
    <p>{ping} ms{" "}{fps} fps</p>
  </>);
}

export { TagWarUI };
