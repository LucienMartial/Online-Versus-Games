import {
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FriendsContext, SocialContext, UserContext } from "../../App";
import AppButton from "../lib/AppButton";
import LoadingPage from "../LoadingPage";
import { FiUserPlus } from "react-icons/fi";

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

  const pageStyle = "flex flex-col justify-center items-center mt-4 ";

  if (loading) {
    return (
      <div className={pageStyle + "h-full"}>
        <LoadingPage />
      </div>
    );
  }

  return (
    <StrictMode>
      <div className={pageStyle}>
        <section className="flex items-center gap-5">
          <h1>{username}</h1>
          {!alreadyFriend && (
            <button
              className="flex items-center text-xl gap-2 bg-blue-700 px-3 py-3 rounded-md"
              onClick={sendRequest}
            >
              <FiUserPlus />
            </button>
          )}
        </section>
        {handleRemoveAccount && isUser && (
          <AppButton color={"danger"} onClick={handleRemoveAccount}>
            Delete my account
          </AppButton>
        )}
      </div>
    </StrictMode>
  );
}

export default Overview;
