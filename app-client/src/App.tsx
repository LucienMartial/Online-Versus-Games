import { useEffect, useState, Suspense, lazy, createContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoadingPage from "./components/LoadingPage";
import { useGameConnect } from "./hooks/useGameConnect";
import useAccount from "./hooks/useAccount";
import { ObjectId } from "mongodb";
import useFriends, { useFriendsRes } from "./hooks/useFriends";
import useSocial, { useSocialRes } from "./hooks/useSocial";

const Game = lazy(() => import("./components/game/Game"));
const Login = lazy(() => import("./components/forms/Login"));
const Register = lazy(() => import("./components/forms/Register"));
const Home = lazy(() => import("./components/user/Home"));
const Page404 = lazy(() => import("./components/Page404"));
const Privacy = lazy(() => import("./components/static-pages/Privacy"));
const Acknowledgement = lazy(
  () => import("./components/static-pages/Acknowledgment")
);
const User = lazy(() => import("./components/user/User"));
const Shop = lazy(() => import("./components/user/Shop"));

// user context
interface UserContextType {
  id: ObjectId;
  username: string;
}
const UserContext = createContext<UserContextType>({} as UserContextType);

// Friends context
const FriendsContext = createContext<useFriendsRes>({} as useFriendsRes);

// Social context
const SocialContext = createContext<useSocialRes>({} as useSocialRes);

function App() {
  const [userData, setUserData] = useState<UserContextType>(
    {} as UserContextType
  );
  const [loaded, setLoaded] = useState(false);
  const { loggedIn, tryLogin, tryLogout, tryRegister, tryRemoveAccount } =
    useAccount();
  const { gameRoom, client, tryReconnection, tryConnection, setGameRoom } =
    useGameConnect();
  const friendsRes = useFriends();
  const socialRes = useSocial();

  // try to reconnect
  useEffect(() => {
    if (!client) return;
    const load = async () => {
      // game already defined
      if (gameRoom) {
        setLoaded(true);
        return;
      }
      // try to reconnect
      try {
        await tryReconnection();
      } catch (e) {
        console.log("could not reconnect", e);
      }
      setLoaded(true);
    };
    load();
  }, [client]);

  // change local storage every connection/disconnection
  useEffect(() => {
    setLoaded(false);
    if (loggedIn === false) {
      socialRes.destroy();
      friendsRes.destroy();
      setLoaded(true);
      return;
    }

    const load = async () => {
      const userDataString = localStorage.getItem("user-data");
      if (!userDataString) return;
      const userData: UserContextType = JSON.parse(userDataString);
      setUserData(userData);
      // join social
      if (client) {
        await socialRes.tryConnectSocial(client);
      }
      setLoaded(true);
    };

    load();
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

  // Login locked page

  const renderHome = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    if (client && gameRoom) return <Navigate to={"/game"} />;
    return (
      <Home
        tryConnection={tryConnection}
        tryLogout={tryLogout}
        client={client}
      />
    );
  };

  const renderGame = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    if (!client || !gameRoom) return <Navigate to={"/home"} />;
    return (
      <Game client={client} gameRoom={gameRoom} setGameRoom={setGameRoom} />
    );
  };

  const renderUser = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    return <User tryLogout={tryLogout} tryRemoveAccount={tryRemoveAccount} />;
  };

  // shop page

  const renderShop = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    return <Shop />;
  };

  // free access page

  const renderLogin = () => {
    if (loggedIn) return <Navigate to={"/"} />;
    return <Login tryLogin={tryLogin} />;
  };

  const renderRegister = () => {
    if (loggedIn) return <Navigate to={"/"} />;
    return <Register tryRegister={tryRegister} />;
  };

  return (
    <UserContext.Provider value={userData}>
      <FriendsContext.Provider value={friendsRes}>
        <SocialContext.Provider value={socialRes}>
          <Router>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path="/" element={renderDefault()} />
                <Route path="/home" element={renderHome()} />
                <Route
                  path="/user"
                  element={<Navigate to={"/user/" + userData.username} />}
                />
                <Route path="/user/:username" element={renderUser()} />
                <Route path="/shop" element={renderShop()} />
                <Route path="/login" element={renderLogin()} />
                <Route path="/register" element={renderRegister()} />
                <Route path="/game" element={renderGame()} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/acknowledgment" element={<Acknowledgement />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Suspense>
          </Router>
        </SocialContext.Provider>
      </FriendsContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
export { UserContext, FriendsContext, SocialContext };
export type { UserContextType };
