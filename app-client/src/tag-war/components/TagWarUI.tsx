import { StrictMode, useState } from "react";
import { TagWarScene } from "../game";

interface GameUIProps {
  gameScene: TagWarScene;
}

function TagWarUI({ gameScene }: GameUIProps) {
  const [ping, setPing] = useState(gameScene.pingInterval);

  setInterval(() => {
    setPing(Math.floor(gameScene.pingInterval));
  }, 200);

  return (<>
    <p>Ping {ping}</p>
  </>);
}

export { TagWarUI };
