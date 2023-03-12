import { createContext, lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import LoadingPage from "./components/LoadingPage";
import { useGameConnect } from "./hooks/useGameConnect";
import useAccount from "./hooks/useAccount";
import { ObjectId } from "mongodb";
import useFriends, { useFriendsRes } from "./hooks/useFriends";
import useSocial, { useSocialRes } from "./hooks/useSocial";
import { Assets } from "@pixi/assets";
import { manifest } from "./game/configs/assets-config";
import { DiscWarScene } from "./disc-war/game";
import DiscWarUI from "./disc-war/components/GameUI";
import EndScreen from "./disc-war/components/EndScreen";
import { TagWarScene } from "./tag-war/game";
import { TagWarUI } from "./tag-war/components/TagWarUI";
import TagWarEndScreen from "./tag-war/components/TagWarEndScreen";

const Game: any = lazy(() => import("./components/game/Game"));
const Login = lazy(() => import("./components/forms/Login"));
const Register = lazy(() => import("./components/forms/Register"));
const Home = lazy(() => import("./components/home/Home"));
const Page404 = lazy(() => import("./components/Page404"));
const Privacy = lazy(() => import("./components/static-pages/Privacy"));
const Acknowledgement = lazy(
  () => import("./components/static-pages/Acknowledgment"),
);
const User = lazy(() => import("./components/user/User"));
const Shop = lazy(() => import("./components/user/shop/Shop"));
const Settings = lazy(() => import("./components/user/settings/Settings"));
const MainUI = lazy(() => import("./components/lib/MainUI"));

// user context
interface UserContextType {
  id: ObjectId;
  username: string;
}
const UserContext = createContext<UserContextType>({} as UserContextType);

// user settings context
interface UserSettingsContextType {
  soundEnabled: boolean;
  musicEnabled: boolean;
}
const UserSettingsContext = createContext<UserSettingsContextType>(
  {} as UserSettingsContextType,
);

// Friends context
const FriendsContext = createContext<useFriendsRes>({} as useFriendsRes);

// Social context
const SocialContext = createContext<useSocialRes>({} as useSocialRes);

function App() {
  const [userData, setUserData] = useState<UserContextType>(
    {} as UserContextType,
  );
  const [userSettings, setUserSettings] = useState<UserSettingsContextType>({
    soundEnabled: true,
    musicEnabled: true,
  });
  const [loaded, setLoaded] = useState(false);
  const { loggedIn, tryLogin, tryLogout, tryRegister, tryRemoveAccount } =
    useAccount();
  const { gameRoom, client, tryReconnection, tryConnection, setGameRoom } =
    useGameConnect();
  const friendsRes = useFriends();
  const socialRes = useSocial();

  // try to reconnect to last game
  useEffect(() => {
    // still loading
    if (loggedIn === null) return;

    // could not connect, got disconnect
    if (loggedIn === false) {
      socialRes.destroy();
      friendsRes.destroy();
      setLoaded(true);
      return;
    }

    const load = async () => {
      // get user data
      const userDataString = localStorage.getItem("user-data");
      if (!userDataString) return;
      const userData: UserContextType = JSON.parse(userDataString);
      setUserData(userData);

      // load settings
      const userSettingsString = localStorage.getItem("user-settings");
      if (userSettingsString) {
        const userSettings: UserSettingsContextType =
          JSON.parse(userSettingsString);
        setUserSettings(userSettings);
      }

      // load assets
      await Assets.init({ manifest: manifest });

      // websocket connections
      if (client) {
        // try to connect to social
        await socialRes.tryConnectSocial(client);
        // try to reconnect to game
        try {
          await tryReconnection();
        } catch (e) {
          if (e instanceof Error) {
            console.error("could not reconnect", e.message);
          }
        }
      }

      setLoaded(true);
    };
    load();
  }, [client, loggedIn]);

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
      <MainUI tryLogout={tryLogout}>
        <Home tryConnection={tryConnection} client={client} />
      </MainUI>
    );
  };

  const renderGame = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    if (!client || !gameRoom) return <Navigate to={"/home"} />;

    // tag war
    if (gameRoom.name == "tag-war") {
      return (
        <Game
          client={client}
          gameRoom={gameRoom}
          setGameRoom={setGameRoom}
          GameUI={TagWarUI}
          EndScreen={TagWarEndScreen}
          game={TagWarScene}
        />
      );
    }

    // disc war
    return (
      <Game
        client={client}
        gameRoom={gameRoom}
        setGameRoom={setGameRoom}
        GameUI={DiscWarUI}
        EndScreen={EndScreen}
        game={DiscWarScene}
      />
    );
  };

  const renderUser = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    return (
      <MainUI tryLogout={tryLogout}>
        <User tryRemoveAccount={tryRemoveAccount} />
      </MainUI>
    );
  };

  // settings page

  const renderSettings = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    return (
      <MainUI tryLogout={tryLogout}>
        <Settings />
      </MainUI>
    );
  };

  // shop page

  const renderShop = () => {
    if (!loggedIn) return <Navigate to={"/login"} />;
    return (
      <MainUI tryLogout={tryLogout}>
        <Shop />
      </MainUI>
    );
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
          <UserSettingsContext.Provider value={userSettings}>
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
                  <Route path="/settings" element={renderSettings()} />
                  <Route path="/login" element={renderLogin()} />
                  <Route path="/register" element={renderRegister()} />
                  <Route path="/game" element={renderGame()} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/acknowledgment" element={<Acknowledgement />} />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </Suspense>
            </Router>
          </UserSettingsContext.Provider>
        </SocialContext.Provider>
      </FriendsContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
export { FriendsContext, SocialContext, UserContext, UserSettingsContext };
export type { UserContextType, UserSettingsContextType };
