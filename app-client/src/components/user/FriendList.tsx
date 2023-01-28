// TODO: Headebar component

import { useCallback, useContext, useEffect, useState } from "react";
import { Friend } from "../../../../app-shared/types";
import { FriendsContext } from "../../App";
import LoadingPage from "../LoadingPage";
import FriendRequestsList from "./FriendRequestsList";

interface FriendListProps {}

function FriendList({}: FriendListProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { friendsRequestsData, tryGetFriends } = useContext(FriendsContext);
  const [friends, setFriends] = useState<Friend[]>([]);

  const onFriendAccept = useCallback(() => {
    setFriends([...friendsRequestsData.current!.friendsData.friends]);
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

  if (loading) {
    return (
      <section className="bg-slate-800 flex justify-center max-w-md mx-auto mt-5">
        <LoadingPage />
      </section>
    );
  }

  if (error || !friendsRequestsData.current) {
    return (
      <section className="bg-slate-800 max-w-md mx-auto mt-5">
        <h2 className="text-3xl">Friends</h2>
        <p>Sorry, it seems we could not load the friends list..</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-800 max-w-md mx-auto mt-5">
      <h2 className="text-3xl">Friends</h2>
      <ul>
        {friends.map((friend) => {
          return <li key={friend.user_id.toString()}>{friend.username}</li>;
        })}
      </ul>
      <FriendRequestsList onFriendAccept={onFriendAccept} />
    </section>
  );
}

export default FriendList;
