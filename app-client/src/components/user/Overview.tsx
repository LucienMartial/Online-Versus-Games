import {
  StrictMode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FriendsContext } from "../../App";
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

  const checkIfFriend = useCallback(() => {
    if (!friendsRequestsData.current) return;
    setAlreadyFriend(
      isUser ||
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
    const load = async () => {
      await tryGetFriends();
      checkIfFriend();
      setLoading(false);
    };
    load();
  }, []);

  const sendRequest = useCallback(async () => {
    try {
      await sendFriendRequest(username);
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
