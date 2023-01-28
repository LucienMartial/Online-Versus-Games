// TODO: Headebar component

import { useCallback, useContext, useEffect, useState } from "react";
import { FriendsContext, UserContext } from "../../App";
import AppButton from "../lib/AppButton";
import LoadingPage from "../LoadingPage";

interface FriendListProps {}

function FriendList({}: FriendListProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { friendsRequestsData, tryGetFriends } = useContext(FriendsContext);
  const { id } = useContext(UserContext);

  useEffect(() => {
    async function load() {
      try {
        await tryGetFriends();
      } catch (e) {
        if (e instanceof Error) setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [friendsRequestsData]);

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
        {friendsRequestsData.current.friendsData.friends.map((friend) => {
          return <li>{friend.username}</li>;
        })}
      </ul>
      <h2 className="text-3xl">Requests</h2>
      <ul className="flex justify-center">
        {friendsRequestsData.current.requestsData.map((request) => {
          const received = request.recipient === id;
          return (
            <li key={request.recipient.toString()}>
              <div className="flex items-center gap-2 text-lg">
                <p>{received ? "Received from" : "Sent to"}</p>
                <p>
                  {received ? request.expeditorName : request.recipientName}
                </p>
                {received && (
                  <div className="flex gap-2">
                    <AppButton color="regular">Accept</AppButton>
                    <AppButton color="regular">Refuse</AppButton>
                  </div>
                )}
                {!received && <AppButton color="regular">Cancel</AppButton>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FriendList;
