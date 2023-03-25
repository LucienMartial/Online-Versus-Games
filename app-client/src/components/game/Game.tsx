import React, { Dispatch, useState } from "react";
import { useEffect, useRef } from "react";
import { Application, Ticker } from "pixi.js";
import { Viewport } from "pixi-viewport";
import "./Game.css";
import { GameScene } from "../../game/scene";
import { Client, Room } from "colyseus.js";
import {
  WORLD_HEIGHT,
  WORLD_WIDTH,
} from "../../../../app-shared/utils/constants";
import useTitle from "../../hooks/useTitle";

export interface GameProps<T, G extends GameScene<T>> {
  displayName : string;
  client: Client;
  gameRoom: Room<T>;
  setGameRoom: Dispatch<Room<T> | undefined>;
  GameUI: React.FC<{ gameScene: GameScene<T> }>;
  EndScreen: React.FC<
    {
      gameScene: GameScene<T>;
      endGameState: any;
      setGameRoom: any;
      chatRoom: any;
    }
  >;
  game: {
    new (
      viewport: Viewport,
      sceneElement: HTMLElement,
      client: Client,
      room: Room<T>,
    ): G;
  };
}

// T: game state, E: end game state, G: game scene
function Game<T, E, G extends GameScene<T>>(
  { client, gameRoom, setGameRoom, GameUI, EndScreen, game, displayName }: GameProps<T, G>,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guiRef = useRef<HTMLDivElement>(null);
  const [gameScene, setGameScene] = useState<GameScene<T> | undefined>();
  const [endGameState, setEndGameState] = useState<E>();
  const [chatRoom, setChatRoom] = useState<Room | null>(null);

  useTitle(displayName || "Game");

  const screenIsTouchable = "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

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
    const gameScene = new game(
      viewport,
      canvasRef.current!,
      client,
      gameRoom,
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
      const desiredHeight = screenIsTouchable
        ? window.innerHeight / 1.5
        : window.innerHeight;
      app.renderer.resize(document.documentElement.clientWidth, desiredHeight);
      gameScene.stage.filterArea = app.renderer.screen;
      viewport.resize(document.documentElement.clientWidth, desiredHeight);
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
      },
    );

    // end of game
    gameRoom.onMessage("end-game", (state: E) => {
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
    <main id="game" className="bg-[#000011]">
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
