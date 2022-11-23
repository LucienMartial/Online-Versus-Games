import { useEffect, useRef } from "react";
import { GameApp } from "./gameApp";
import "./Game.css";

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);

  // on mount
  useEffect(() => {
    const app = new GameApp(canvasRef.current!);
    const resize = () => {
      app.resize();
      guiRef.current!.style.width = canvasRef.current!.style.width;
      guiRef.current!.style.height = canvasRef.current!.style.height;
      guiRef.current!.style.fontSize =
        (1 / (100.0 / parseInt(canvasRef.current!.style.width))) * 0.15 + "rem";
    };
    resize();
    window.addEventListener("resize", resize);
    window.requestAnimationFrame(app.run.bind(app));
    // on unmount
    return () => {
      app.pixiApp.destroy();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main ref={mainRef}>
      <div id="gui" ref={guiRef}>
        <p>Example GUI element rendered on top of the game!</p>
      </div>
      <canvas ref={canvasRef}></canvas>
    </main>
  );
}
