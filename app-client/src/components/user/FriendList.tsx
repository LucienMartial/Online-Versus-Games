// TODO: Headebar component

import { useCallback, useContext, useEffect, useState } from "react";
import { FriendsContext } from "../../App";

interface FriendListProps {}

function FriendList({}: FriendListProps) {
  const [error, setError] = useState<string | null>(null);
  const { friendsData, tryGetFriends } = useContext(FriendsContext);

  useEffect(() => {
    async function load() {
      try {
        await tryGetFriends();
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      }
    }
    load();
  }, []);

  if (error) {
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
        <li>Friend</li>
      </ul>
    </section>
  );
}

export default FriendList;
