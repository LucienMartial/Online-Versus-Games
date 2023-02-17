import React, { Dispatch, useState } from "react";
import { useEffect, useRef } from "react";
import { Application, Ticker } from "pixi.js";
import { Viewport } from "pixi-viewport";
import "./Game.css";
import { GameScene } from "../../disc-war/game";
import { Client, Room } from "colyseus.js";
import {
  WORLD_WIDTH,
  WORLD_HEIGHT,
} from "../../../../app-shared/utils/constants";
import GameUI from "../../disc-war/components/GameUI";
import EndScreen from "./EndScreen";
import { EndGameState, GameState } from "../../../../app-shared/disc-war/state";
import { Assets } from "@pixi/assets";
import { manifest } from "../../game/configs/assets-config";
import inputButtons from "../../types/inputButtons";
import GameKeyboard from "./GameKeyboard";

export interface GameProps {
  client: Client;
  gameRoom: Room<GameState>;
  setGameRoom: Dispatch<Room<GameState> | undefined>;
}

function Game({ client, gameRoom, setGameRoom }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);
  const [gameScene, setGameScene] = useState<GameScene | undefined>();
  const [endGameState, setEndGameState] = useState<EndGameState>();
  const [chatRoom, setChatRoom] = useState<Room | null>(null);

  const leftButton = useRef<HTMLButtonElement>(null);
  const rightButton = useRef<HTMLButtonElement>(null);
  const upButton = useRef<HTMLButtonElement>(null);
  const downButton = useRef<HTMLButtonElement>(null);
  const dashButton = useRef<HTMLButtonElement>(null);
  const shieldButton = useRef<HTMLButtonElement>(null);

  const load = async () => {
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
      gameRoom,
      {
        left: leftButton.current!,
        right: rightButton.current!,
        up: upButton.current!,
        down: downButton.current!,
        dash: dashButton.current!,
        shield: shieldButton.current!,
      } as inputButtons
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

    // reservation for end-game chat
    gameRoom.onMessage(
      "end-game-chat-reservation",
      async (reservation: Object) => {
        try {
          const room = await client.consumeSeatReservation(reservation);
          setChatRoom(room);
          console.log("joined successfully end-game chat room", room);
        } catch (e) {
          console.error("join error", e);
        }
      }
    );

    // end of game
    gameRoom.onMessage("end-game", (state: EndGameState) => {
      ticker.stop();
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
  };

  useEffect(() => {
    if (chatRoom) return;
    load();
    leftButton.current?.addEventListener("keydown", (e) => {
      console.log(e);
    });
  }, []);

  // end of game?
  if (endGameState && gameScene && chatRoom) {
    return (
      <EndScreen
        gameScene={gameScene}
        endGameState={endGameState}
        setGameRoom={setGameRoom}
        chatRoom={chatRoom}
      />
    );
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
      <GameKeyboard
        leftButton={leftButton}
        rightButton={rightButton}
        upButton={upButton}
        downButton={downButton}
        dashButton={dashButton}
        shieldButton={shieldButton}
      />
    </main>
  );
}

export default Game;
