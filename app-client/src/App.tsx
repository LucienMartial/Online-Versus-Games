import React, { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { hello } from "../../app-shared/hello";
import { Message } from "../../app-shared/types";
import { GameProps } from "./components/Game";
import { Assets } from "@pixi/assets";
import { Client, Room } from "colyseus.js";
import { useAuth } from "./hooks/useAuth";

const Game = lazy(() => import("./components/Game"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));

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
          srcs: "/character.png",
        },
      ],
    },
  ],
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(true); // dev: true
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
    initAssetsManifest();
  }, []);

  useEffect(() => {
    if (started) initClient();
  }, [started]);

  // still loading
  if (!loaded || isAuth === null) {
    return <p>Loading.. </p>;
  }

  const renderDefault = () => {
    if (!isAuth) {
      return <Navigate to={"/login"} />;
    }
    return <Navigate to={"/game"} />;
  };

  const renderLogin = () => {
    if (isAuth) {
      return <Navigate to={"/"} />;
    }
    return <Login setLoggedIn={setLoggedIn} />;
  };

  const renderGame = () => {
    console.log(isAuth);
    if (!isAuth) {
      return <Navigate to={"/login"} />;
    }
    if (gameData) {
      return <Game {...gameData} />;
    }
  };

  return (
    <Router>
      <Suspense fallback={<p>Loading.. </p>}>
        <Routes>
          <Route path="/" element={renderDefault()} />
          <Route path="/login" element={renderLogin()} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={renderGame()} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
