import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Application, Ticker } from "pixi.js";
import { Viewport } from "pixi-viewport";
import "./Game.css";
import { GameScene } from "../game/game";
import { Client, Room } from "colyseus.js";
import { GameState } from "../../../app-shared/state/game-state";
import { WORLD_WIDTH, WORLD_HEIGHT } from "../../../app-shared/utils/constants";
import GameUI from "./GameUI";
import EndScreen from "./EndScreen";
import { EndGameState } from "../../../app-shared/state";

export interface GameProps {
  client: Client;
  gameRoom: Room<GameState>;
}

function Game({ client, gameRoom }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);
  const [gameScene, setGameScene] = useState<GameScene | undefined>();
  const [endGameState, setEndGameState] = useState<EndGameState>();

  useEffect(() => {
    const app = new Application({
      view: canvasRef.current!,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: 0x000011, //0x000011,
    });

    // set viewport
    const viewport = new Viewport({
      worldWidth: WORLD_WIDTH,
      worldHeight: WORLD_HEIGHT,
      passiveWheel: false,
    });

    app.stage.addChild(viewport);

    // create game
    const gameScene = new GameScene(
      viewport,
      canvasRef.current!,
      client,
      gameRoom
    );
    setGameScene(gameScene);

    // run, smooth rendering over 10 frames
    const ticker = new Ticker();
    const smoothingFrames = 10;

    let smoothedFrameDuration = 0;
    ticker.add((dt) => {
      smoothedFrameDuration =
        (smoothedFrameDuration * (smoothingFrames - 1) + dt) / smoothingFrames;
      const now = Date.now();
      gameScene.update(smoothedFrameDuration * 0.001, now);
      gameScene.updateRenderables(smoothedFrameDuration * 0.001, now);
    });

    // load scene
    gameScene.load().then(() => {
      viewport.addChild(gameScene.stage);
      // launch game
      ticker.start();
    });

    // resize
    const resize = () => {
      app.renderer.resize(window.innerWidth, window.innerHeight);
      gameScene.stage.filterArea = app.renderer.screen;
      viewport.resize(window.innerWidth, window.innerHeight);
      viewport.fit();
      viewport.moveCenter(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
    };
    resize();
    window.addEventListener("resize", resize);

    // end of game
    gameRoom.onMessage("end-game", (state: EndGameState) => {
      ticker.stop();
      console.log("leave");
      gameRoom.removeAllListeners();
      gameRoom.leave();
      setEndGameState(state);
    });

    // on unmount
    return () => {
      viewport.destroy();
      app.destroy();
      window.removeEventListener("resize", resize);
    };
  }, []);

  // end of game?
  if (endGameState && gameScene) {
    return <EndScreen gameScene={gameScene} endGameState={endGameState} />;
  }

  return (
    <main id="game">
      <React.StrictMode>
        <div id="gui" ref={guiRef}>
          {gameScene && (
            <>
              <GameUI gameScene={gameScene}></GameUI>
            </>
          )}
        </div>
      </React.StrictMode>
      <canvas ref={canvasRef}></canvas>
    </main>
  );
}

export default Game;
