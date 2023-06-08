import { useState } from "react";
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

  function displayPing(ping: number) {
    if (ping < 50) {
      return <span className={"flex text-green-500"}>Ping: {ping} ms</span>;
    } else if (ping < 100) {
      return <span className={"flex text-yellow-500"}>Ping: {ping} ms</span>;
    } else {
      return <span className={"flex text-red-500"}>Ping: {ping} ms</span>;
    }
  }

  function displayFps(fps: number) {
    if (fps > 50) {
      return <span className={"flex text-green-500"}>FPS: {fps}</span>;
    } else if (fps > 25) {
      return <span className={"flex text-yellow-500"}>FPS: {fps}</span>;
    } else {
      return <span className={"flex text-red-500"}>FPS: {fps}</span>;
    }
  }

  return (
    <>
      <div className={"flex-col justify-start m-8"}>
        {displayPing(ping)}
        {displayFps(fps)}
      </div>
    </>
  );
}

export { TagWarUI };
