import {
  Dispatch,
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useState,
  SetStateAction,
} from "react";
import { DiscWarScene } from "../../disc-war/game";
import {
  EndGamePlayerState,
  EndGameState,
  GameState,
} from "../../../../app-shared/disc-war/state";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../../components/chat-components/ChatContainer";
import { Room } from "colyseus.js";
import { FiUser } from "react-icons/fi";
import ProfilePopup from "../../components/user/ProfilePopup";
import AppButton from "../../components/lib/AppButton";
import { UserContext } from "../../App";

function PlayerRow({
  player,
  himself,
  setProfileName,
}: {
  id: string;
  player: EndGamePlayerState;
  himself: boolean;
  setProfileName: Dispatch<SetStateAction<null | string>>;
}) {
  return (
    <tr className="group hover:bg-slate-800">
      <td className="text-left py-5">
        <div className="flex items-center">
          <span className="border-l-4 h-16 -mt-6 -mb-6 border-blue-900 group-hover:border-blue-400">
          </span>
          <button
            className="ml-4 text-lg"
            onClick={() => setProfileName(player.username)}
          >
            <FiUser />
          </button>
          <span className="ml-4">{player.username}</span>
        </div>
      </td>
      <td>{player.stats.deaths}</td>
      <td>{player.stats.straightShots}</td>
      <td>{player.stats.curveShots}</td>
      <td>{player.stats.shields}</td>
      <td>{player.stats.shieldCatches}</td>
      <td>{player.stats.dashes}</td>
    </tr>
  );
}

interface EndScreenProps {
  gameScene: DiscWarScene;
  endGameState: EndGameState;
  setGameRoom: Dispatch<Room<GameState> | undefined>;
  chatRoom: Room;
}

function EndScreen({
  gameScene,
  endGameState,
  setGameRoom,
  chatRoom,
}: EndScreenProps) {
  const userData = useContext(UserContext);
  const [profileName, setProfileName] = useState<null | string>(null);
  const listPlayers: JSX.Element[] = [];
  let victory = false;
  [...Object.entries(endGameState.players)].forEach(([id, state]) => {
    // current player
    if (id === gameScene.id) {
      victory = state.victory;
    }
    // info for list of players
    listPlayers.push(
      <PlayerRow
        key={id}
        id={id}
        player={state}
        himself={id === gameScene.id}
        setProfileName={setProfileName}
      />,
    );
  });

  const navigate = useNavigate();
  const leaveGame = useCallback(() => {
    chatRoom.leave();
    navigate("/home");
    setGameRoom(undefined);
  }, []);

  useEffect(() => {
    return () => {
      leaveGame();
    };
  }, []);

  if (profileName) {
    return (
      <ProfilePopup
        username={profileName}
        setProfileUsername={setProfileName}
      />
    );
  }

  return (
    <StrictMode>
      <main className="flex flex-col w-screen h-screen items-center pt-2 sm:pt-12 min-h-0">
        <h1 className="text-6xl pt-5">{victory ? "Victory" : "Defeat"}</h1>
        <section className="transition-all w-full p-4 my-8">
          <table className="w-full table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-2 py-1 w-3/6 text-left">Players</th>
                <th className="text-vertical sm:text-initial">Deaths</th>
                <th className="text-vertical sm:text-initial">Straight Shots</th>
                <th className="text-vertical sm:text-initial">Curve Shots</th>
                <th className="text-vertical sm:text-initial">Shields</th>
                <th className="text-vertical sm:text-initial">Shield Catches</th>
                <th className="text-vertical sm:text-initial">Dashes</th>
              </tr>
            </thead>
            <tbody>{listPlayers}</tbody>
          </table>
        </section>
        <section className={"flex flex-col justify-evenly items-center w-full h-full grow gap-1"}>
          <ChatContainer chatRoom={chatRoom} />
          <AppButton className="my-6" color="danger" onClick={leaveGame}>
            Leave
          </AppButton>
        </section>
      </main>
    </StrictMode>
  );
}

export default EndScreen;
