import { useEffect, useRef } from "react";
import { init, run } from "./main";

export default function Game() {
  const canvasRef = useRef(null);

  // on mount
  useEffect(() => {
    init(canvasRef.current!);
    window.requestAnimationFrame(run);
  });

  return (
    <main>
      <h1>Game</h1>
      <canvas ref={canvasRef}></canvas>
    </main>
  );
}
