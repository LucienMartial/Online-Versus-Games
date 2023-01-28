import { useCallback, useContext, useEffect, useState } from "react";
import { Friend } from "../../../app-shared/types";
import { FriendsContext } from "../App";
import LoadingPage from "../components/LoadingPage";
import FriendRequestsList from "./FriendRequestsList";
import FriendTab from "./FriendTab";
import FriendUser from "./FriendUser";

interface FriendListProps {}

function FriendList({}: FriendListProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { friendsRequestsData, tryGetFriends, removeFriend } =
    useContext(FriendsContext);
  const [friends, setFriends] = useState<Friend[]>([]);

  const onFriendAccept = useCallback(() => {
    setFriends([...friendsRequestsData.current!.friendsData.friends]);
  }, []);

  const onRemoveFriend = useCallback(async (friendName: string) => {
    try {
      await removeFriend(friendName);
      setFriends([...friendsRequestsData.current!.friendsData.friends]);
    } catch (e) {
      if (e instanceof Error)
        console.error("could not remove friend", e.message);
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        await tryGetFriends();
        setFriends([...friendsRequestsData.current!.friendsData.friends]);
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const mainClasses = "bg-slate-800 w-full max-w-xs mx-auto h-full ";

  if (loading) {
    return (
      <section className={mainClasses + "flex justify-center"}>
        <LoadingPage />
      </section>
    );
  }

  if (error || !friendsRequestsData.current) {
    return (
      <section className={mainClasses}>
        <h2 className="text-3xl">Friends</h2>
        <p>Sorry, it seems we could not load the friends list..</p>
      </section>
    );
  }

  return (
    <section className={mainClasses}>
      <FriendTab
        expandedByDefault={false}
        title="Requests"
        notifCount={friendsRequestsData.current.requestsData.length}
      >
        <FriendRequestsList onFriendAccept={onFriendAccept} />
      </FriendTab>
      <FriendTab expandedByDefault={true} title="Friends">
        <ul className="mt-2">
          {friends.map((friend) => (
            <FriendUser
              key={friend.user_id.toString()}
              friend={friend}
              onRemoveFriend={onRemoveFriend}
            />
          ))}
        </ul>
      </FriendTab>
    </section>
  );
}

export default FriendList;
