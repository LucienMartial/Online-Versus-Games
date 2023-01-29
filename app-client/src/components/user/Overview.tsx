import {
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FriendRequest } from "../../../../app-shared/types";
import { FriendsContext, SocialContext, UserContext } from "../../App";
import AppButton from "../lib/AppButton";
import LoadingPage from "../LoadingPage";

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
  // check if it's own user profile
  const userData = useContext(UserContext);
  const sameUser = userData.username === username;
  const { socialRoom } = useContext(SocialContext);

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

  useEffect(() => {
    const load = async () => {
      await tryGetFriends(true);
      checkIfFriend();
      setLoading(false);
    };
    load();
  }, []);

  const sendRequest = useCallback(async () => {
    try {
      const userId = await sendFriendRequest(username);
      socialRoom?.send("request:new", userId);
      setAlreadyFriend(true);
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  }, []);

  if (loading) {
    return (
      <div className={" h-full flex flex-col justify-center items-center mt-4"}>
        <LoadingPage />
      </div>
    );
  }

  return (
    <StrictMode>
      <div className={"flex flex-col justify-center items-center mt-4"}>
        <h1>{username}</h1>
        {!alreadyFriend && (
          <AppButton color="regular" onClick={sendRequest}>
            Send Friend Request
          </AppButton>
        )}
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
