import {
  StrictMode,
  Dispatch,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import { GameScene } from "../../disc-war/game";
import {
  EndGamePlayerState,
  EndGameState,
  GameState,
} from "../../../../app-shared/state";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../chat-components/ChatContainer";
import { Room } from "colyseus.js";
import { FiUser } from "react-icons/fi";
import ProfilePopup from "../user/ProfilePopup";
import AppButton from "../lib/AppButton";
import { UserContext } from "../../App";

interface EndScreenProps {
  gameScene: GameScene;
  endGameState: EndGameState;
  setGameRoom: Dispatch<Room<GameState> | undefined>;
  chatRoom: Room;
}

function PlayerRow({
  player,
  himself,
  setProfileName,
}: {
  id: string;
  player: EndGamePlayerState;
  himself: boolean;
  setProfileName: Dispatch<React.SetStateAction<null | string>>;
}) {
  return (
    <tr className="group hover:bg-slate-800">
      <td className="text-left py-5">
        <div className="flex items-center">
          <span className="border-l-4 h-16 -mt-6 -mb-6 border-blue-900 group-hover:border-blue-400"></span>
          <button
            className="ml-4 text-lg"
            onClick={() => setProfileName(player.username)}
          >
            <FiUser />
          </button>
          <span className="ml-4">{player.username}</span>
        </div>
      </td>
      <td>{player.deaths}</td>
      <td>{player.straightShots}</td>
      <td>{player.curveShots}</td>
      <td>{player.shields}</td>
      <td>{player.shieldCatches}</td>
      <td>{player.dashes}</td>
    </tr>
  );
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
      />
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
      <main className="flex flex-col w-screen h-screen justify-between items-center my-12">
        <h1 className="text-6xl pt-5">{victory ? "Victory" : "Defeat"}</h1>
        <section className="transition-all w-full p-4 my-8">
          <table className="w-full table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-2 py-1 w-3/6 text-left">Players</th>
                <th>Deaths</th>
                <th>Straight Shots</th>
                <th>Curve Shots</th>
                <th>Shields</th>
                <th>Shield Catches</th>
                <th>Dashes</th>
              </tr>
            </thead>
            <tbody>{listPlayers}</tbody>
          </table>
        </section>
        <section className="grow">
          <ChatContainer chatRoom={chatRoom} />
        </section>
        <AppButton color="regular" onClick={leaveGame}>
          Leave
        </AppButton>
      </main>
    </StrictMode>
  );
}

export default EndScreen;
