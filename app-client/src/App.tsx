import React, { useEffect, useState } from "react";
import "./App.css";
import { hello } from "../../app-shared/hello";
import { Message, Checker } from "../../app-shared/types";
import Game, { GameProps } from "./components/Game";
import { Assets } from "@pixi/assets";
import { Client, Room } from "colyseus.js";
import Login from "./components/Login";

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
  const [started, setStarted] = useState(true); // dev: true
  const [gameData, setGameData] = useState<GameProps>();
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  const fetchData = async () => {
    const res0 = await fetch("/api");
    const msg: Message = await res0.json();
    console.log(msg);
    console.log(hello());
    const res1 = await fetch("/api/cookie-checker");
    const msg1: Checker = await res1.json();
    console.log(msg1);
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

  const login = () => {
    setUserLoggedIn(true);
  }

  useEffect(() => {
    fetchData();
    initClient();
    initAssetsManifest();
  }, []);

  if (!loaded) {
    return <p>Loading.. </p>;
  }

  if(!userLoggedIn) {
    return <Login onLogin={login}/>
  }

  if(userLoggedIn && gameData) {
    return <Game {...gameData} />;
  }

  if (started && gameData) {
    return <Game {...gameData}></Game>;
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
