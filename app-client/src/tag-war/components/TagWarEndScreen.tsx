import { Room } from "colyseus.js";
import {
  Dispatch,
  StrictMode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { EndGameState, GameState } from "../../../../app-shared/tag-war/state";
import { UserContext } from "../../App";
import AppButton from "../../components/lib/AppButton";
import { TagWarScene } from "../game";

interface EndScreenProps {
  gameScene: TagWarScene;
  endGameState: EndGameState;
  setGameRoom: Dispatch<Room<GameState> | undefined>;
  chatRoom: Room;
}

function TagWarEndScreen(
  { gameScene, endGameState, setGameRoom, chatRoom }: EndScreenProps,
) {
  const userData = useContext(UserContext);
  const victory = true;

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

  return (
    <StrictMode>
      <main className="flex flex-col w-screen h-screen items-center my-12">
        <h1 className="text-6xl pt-5">{victory ? "Victory" : "Defeat"}</h1>
        <section className="transition-all w-full p-4 my-8">
          <AppButton color="regular" onClick={leaveGame}>
            Leave
          </AppButton>
        </section>
      </main>
    </StrictMode>
  );
}

export default TagWarEndScreen;
