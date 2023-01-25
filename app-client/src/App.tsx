import { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoadingPage from "./components/LoadingPage";
import { useGameConnect } from "./hooks/useGameConnect";
import useAccount from "./hooks/useAccount";

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
  const { loggedIn, tryLogin, tryLogout, tryRegister, tryRemoveAccount } =
    useAccount();
  const { gameRoom, client, tryReconnection, tryConnection, setGameRoom } =
    useGameConnect();

  // try to reconnect
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
    console.log(loggedIn);
    if (loggedIn === false) setLoaded(true);
  }, [loggedIn]);

  // still loading
  if (!loaded || loggedIn === null) {
    return <LoadingPage />;
  }

  // If not auth, show login page
  // By default, try to reconnect to previous game
  // if possible, else show home menu

  const renderDefault = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    if (client && gameRoom) return <Navigate to={"/game"} />;
    return <Navigate to={"/home"} />;
  };

  const renderHome = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    if (client && gameRoom) return <Navigate to={"/game"} />;
    return (
      <Home
        tryConnection={tryConnection}
        tryLogout={tryLogout}
        tryRemoveAccount={tryRemoveAccount}
      />
    );
  };

  const renderProfile = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    return <Profile tryLogout={tryLogout} />;
  };

  const renderLogin = () => {
    if (loggedIn) return <Navigate to={"/"} />;
    return <Login tryLogin={tryLogin} />;
  };

  const renderRegister = () => {
    if (loggedIn) return <Navigate to={"/"} />;
    return <Register tryRegister={tryRegister} />;
  };

  const renderGame = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    if (!client || !gameRoom) return <Navigate to={"/home"} />;
    return (
      <Game client={client} gameRoom={gameRoom} setGameRoom={setGameRoom} />
    );
  };

  return (
    <Router>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={renderDefault()} />
          <Route path="/home" element={renderHome()} />
          <Route path="/profile" element={renderProfile()} />
          <Route path="/login" element={renderLogin()} />
          <Route path="/register" element={renderRegister()} />
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
