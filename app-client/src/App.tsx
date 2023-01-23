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
import { useAuth } from "./hooks/useAuth";
import LoadingPage from "./components/LoadingPage";
import { useGameConnect } from "./hooks/useGameConnect";

const Game = lazy(() => import("./components/Game"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Home = lazy(() => import("./components/Home"));
const Page404 = lazy(() => import("./components/Page404"));
const Privacy = lazy(() => import("./components/Privacy"));
const Acknowledgement = lazy(() => import("./components/Acknowledgement"));
const Profile = lazy(() => import("./components/Profile"));

function App() {
  const [loaded, setLoaded] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const isAuth = useAuth([isLoggedIn]);
  const { gameRoom, client, tryReconnection, tryConnection } = useGameConnect();

  // fetch api data
  const fetchData = async () => {
    const res = await fetch("/api/");
    const msg: Message = await res.json();
    console.log(msg);
    console.log(hello());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // try to reconenct
  useEffect(() => {
    if (!client) return;
    const load = async () => {
      try {
        await tryReconnection();
      } catch (e) {
        console.log("could not reconnect", e);
      } finally {
        setLoaded(true);
      }
    };
    load();
  }, [client]);

  useEffect(() => {
    if (isAuth === false) setLoaded(true);
  }, [isAuth]);

  // still loading
  if (!loaded || isAuth === null) {
    return <LoadingPage />;
  }

  // If not auth, show login page
  // By default, try to reconnect to previous game
  // if possible, else show home menu

  const renderDefault = () => {
    if (!isAuth) return <Navigate to={"/login"} />;
    if (client && gameRoom) return <Navigate to={"/game"} />;
    return <Navigate to={"/home"} />;
  };

  const renderHome = () => {
    if (!isAuth) return <Navigate to={"/login"} />;
    if (client && gameRoom) return <Navigate to={"/game"} />;
    return <Home tryConnection={tryConnection} />;
  };

  const renderLogin = () => {
    if (isAuth) return <Navigate to={"/"} />;
    return <Login setLoggedIn={setLoggedIn} />;
  };

  const renderGame = () => {
    if (!isAuth) return <Navigate to={"/login"} />;
    if (!client || !gameRoom) return <Navigate to={"/home"} />;
    return <Game client={client} gameRoom={gameRoom} />;
  };

  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={renderDefault()} />
          <Route path="/home" element={renderHome()} />
          <Route path="profile" element={<Profile />} />
          <Route path="/login" element={renderLogin()} />
          <Route path="/register" element={<Register />} />
          <Route path="/game" element={renderGame()} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/acknowledgment" element={<Acknowledgement />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
