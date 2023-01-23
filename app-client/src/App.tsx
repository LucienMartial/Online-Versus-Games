import { useEffect, useState, Suspense, lazy } from "react";
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
import LoadingPage from "./components/LoadingPage";

const Game = lazy(() => import("./components/Game"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Page404 = lazy(() => import("./components/Page404"));

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
  };

  let client: Client;
  let gameRoom: Room;

  const initClient = async () => {
    await initAssetsManifest();
    client = new Client(COLYSEUS_ENDPOINT);

    // try to reconnect to current game
    try {
      console.log("try to reconnect");

      const gameInfo = localStorage.getItem("game-info");
      if (!gameInfo) throw new Error("now game info");
      let data = JSON.parse(gameInfo);
      console.log("reconnection with ", data);

      gameRoom = await client.reconnect(data.roomId, data.sessionId);

      setGameData({ client: client, gameRoom: gameRoom });
      setLoaded(true);
      console.log("reconnected successfuly");
      return;
    } catch (e) {}

    // try to create or join a new game
    try {
      console.log("try to join");
      gameRoom = await client.joinOrCreate("game");

      // save for reconnection
      const data = { roomId: gameRoom.id, sessionId: gameRoom.sessionId };
      localStorage.setItem("game-info", JSON.stringify(data));

      // ui data
      setGameData({ client: client, gameRoom: gameRoom });
      setLoaded(true);
      console.log("joined a game successfully");
    } catch (e) {
      console.error("join error", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("auth:", isAuth);
    if (isAuth === false) setLoaded(true);
    console.log("loaded:", loaded, "auth", isAuth);
  }, [isAuth]);

  useEffect(() => {
    if (started && isAuth) initClient();
  }, [started, isAuth]);

  // still loading
  if (!loaded || isAuth === null) {
    return <LoadingPage />;
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
    if (!isAuth) {
      return <Navigate to={"/login"} />;
    }
    if (gameData) {
      return <Game {...gameData} />;
    }
  };

  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={renderDefault()} />
          <Route path="/login" element={renderLogin()} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={renderGame()} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
