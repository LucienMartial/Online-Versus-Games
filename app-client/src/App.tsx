import React, { useEffect, useState } from "react";
import "./App.css";
import { hello } from "../../app-shared/hello";
import { Message } from "../../app-shared/types";
import Game, { GameProps } from "./components/Game";
import { Assets } from "@pixi/assets";
import { Client, Room } from "colyseus.js";
import Login from "./components/Login";
import { useAuth } from "./hooks/useAuth";

// websocket endpoint
const COLYSEUS_ENDPOINT =
  process.env.NODE_ENV === "development" ? "ws://localhost:3000" : undefined;

// assets information
const manifest = {
  bundles: [
    {
      name: "basic",
      assets: [
        {
          name: "character",
          srcs: "character.png",
        },
      ],
    },
  ],
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false); // dev: true
  const [gameData, setGameData] = useState<GameProps>();
  const [isLoggedIn, setLoggedIn] = useState(false);
  const isAuth = useAuth([isLoggedIn]);

  const fetchData = async () => {
    const res = await fetch("/api/");
    const msg: Message = await res.json();
    console.log(msg);
    console.log(hello());
  };

  const initAssetsManifest = async () => {
    await Assets.init({ manifest: manifest });
    setLoaded(true);
  };

  let client: Client;
  let gameRoom: Room;

  const initClient = async () => {
    client = new Client(COLYSEUS_ENDPOINT);
    // try to join a game room
    try {
      gameRoom = await client.joinOrCreate("game");
      setGameData({ client: client, gameRoom: gameRoom });
      console.log("joined a game successfully");
    } catch (e) {
      console.error("join error", e);
    }
  };

  useEffect(() => {
    fetchData();
    initClient();
    initAssetsManifest();
  }, []);

  // still loading
  if (!loaded || isAuth === null) {
    return <p>Loading.. </p>;
  }

  // authenticated? show game
  if (isAuth && started && gameData) {
    return <Game {...gameData} />;
  }

  // is not auth, show login page
  if (!isAuth) {
    return <Login setLoggedIn={setLoggedIn} />;
  }

  return (
    <React.StrictMode>
      <div className="App">
        <h1>Main Menu</h1>
        <div className="card">
          <button onClick={() => setStarted(true)}>Play</button>
        </div>
      </div>
    </React.StrictMode>
  );
}

export default App;
