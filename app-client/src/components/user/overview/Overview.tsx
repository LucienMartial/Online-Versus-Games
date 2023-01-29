import {
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FriendsContext, SocialContext, UserContext } from "../../../App";
import LoadingPage from "../../LoadingPage";
import { FiUserPlus, FiTrash } from "react-icons/fi";
import StatCard from "./StatCard";

interface OverviewProps {
  username: string;
  handleRemoveAccount?: () => Promise<void>;
  isUser?: boolean;
}

function Overview({ username, handleRemoveAccount, isUser }: OverviewProps) {
  const { friendsRequestsData, tryGetFriends, sendFriendRequest } =
    useContext(FriendsContext);
  const [alreadyFriend, setAlreadyFriend] = useState(false);
  const [loading, setLoading] = useState(true);

  // friend request
  const sendRequest = useCallback(async () => {
    try {
      const userId = await sendFriendRequest(username);
      socialRoom?.send("request:new", userId);
      setAlreadyFriend(true);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }, []);

  // check if it's own user profile
  const userData = useContext(UserContext);
  const sameUser = userData.username === username;

  const checkIfFriend = useCallback(() => {
    if (!friendsRequestsData.current) return;
    setAlreadyFriend(
      sameUser ||
        friendsRequestsData.current.friendsData.friends.some(
          (friend) => friend.username === username
        ) ||
        friendsRequestsData.current.requestsData.some(
          (request) =>
            request.expeditorName === username ||
            request.recipientName === username
        )
    );
  }, [username]);

  // real time update of friend status
  const { socialRoom } = useContext(SocialContext);
  useEffect(() => {
    if (!socialRoom) return;
    socialRoom.removeAllListeners();

    socialRoom.onMessage("*", async (type, message) => {
      switch (type) {
        case "request:new":
        case "request:remove":
        case "friend:remove":
          await tryGetFriends(false);
          checkIfFriend();
          break;
      }
    });
  }, [socialRoom]);

  // load page
  useEffect(() => {
    const load = async () => {
      await tryGetFriends(true);
      checkIfFriend();
      setLoading(false);
    };
    load();
  }, []);

  const pageStyle = "grow flex flex-col justify-center items-center mt-4 px-2 ";

  if (loading) {
    return (
      <div className={pageStyle + "h-full"}>
        <LoadingPage />
      </div>
    );
  }

  return (
    <StrictMode>
      <div
        className={
          pageStyle +
          "md:px-6 w-full max-w-screen-xl h-screen justify-between self-center overflow-auto"
        }
      >
        <section className="flex justify-between items-center  gap-1 mt-2 w-full">
          <div className="flex gap-5 items-center">
            <h1 className="text-5xl font-medium">{username}</h1>
            {!alreadyFriend && (
              <button
                className="flex items-center text-xl gap-2 bg-blue-600 px-2.5 py-2.5 rounded-2xl hover:bg-blue-700"
                onClick={sendRequest}
              >
                <FiUserPlus className="text-xl" />
              </button>
            )}
          </div>
          {handleRemoveAccount && sameUser && (
            <button
              className="flex items-center text-lg gap-2 bg-red-700 px-2 py-1.5 rounded-xl hover:bg-red-800"
              onClick={handleRemoveAccount}
            >
              <FiTrash />
              <p className="mt-0.5 font-medium">Delete my account</p>
            </button>
          )}
        </section>
        <section className="grow m-auto w-full mt-5 mb-1 grid md:grid-cols-5 gap-3 h-fit">
          <section className="rounded-md grid grid-cols-2 bg-slate-700 gap-2 col-span-3 row-span-1 p-2">
            <div className="flex flex-col justify-center rounded-md gap-2 bg-slate-800 p-2">
              <h2 className="text-5xl">Winrate</h2>
              <span className="text-5xl">42%</span>
            </div>
            <div className="flex flex-col justify-center rounded-md gap-2 bg-slate-800 p-2">
              <h2 className="text-5xl">Game</h2>
              <span className="text-5xl">47</span>
            </div>
            <div className="flex flex-col col-span-2 justify-center rounded-md gap-2 bg-slate-800 p-2">
              <h2 className="text-5xl">Score</h2>
              <span className="text-5xl">1/2/4</span>
            </div>
          </section>
          <section className="bg-slate-700 rounded-md col-span-3 md:col-span-2 grid grid-cols-2 gap-2 p-2">
            <StatCard name="Death" average={1.1} total={4} />
            <StatCard name="Kill" average={2.4} total={8} />
            <StatCard name="Shield" average={3} total={13} />
            <StatCard name="Dash" average={8} total={23} />
          </section>
          <section className="grow bg-slate-700 p-2 col-span-3 md:col-span-5 rounded-md grid grid-cols-2 md:grid-cols-4 gap-2">
            <StatCard name="Shot" average={1.1} total={4} />
            <StatCard name="Curve Shot" average={2.4} total={8} />
            <StatCard name="Shield" average={3} total={13} />
            <StatCard name="Shield Catch" average={8} total={23} />
          </section>
        </section>
      </div>
    </StrictMode>
  );
}

export default Overview;
