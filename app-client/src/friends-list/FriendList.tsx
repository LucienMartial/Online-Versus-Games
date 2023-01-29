import { useCallback, useContext, useEffect, useState } from "react";
import { Friend, FriendRequest } from "../../../app-shared/types";
import { FriendsContext, SocialContext, UserContext } from "../App";
import LoadingPage from "../components/LoadingPage";
import FriendRequestsList from "./FriendRequestsList";
import FriendTab from "./FriendTab";
import FriendUser from "./FriendUser";
import { FiRotateCw } from "react-icons/fi";
import { Client } from "colyseus.js";
import { SocialState } from "../../../app-shared/state";
import { ObjectId, WithId } from "mongodb";

interface FriendListProps {
  client: Client | undefined;
}

function isFriend(userId: string, friends: Friend[]): boolean {
  return friends.some((friend) => friend.user_id.toString() === userId);
}

function FriendList({ client }: FriendListProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { friendsRequestsData, tryGetFriends, removeFriend } =
    useContext(FriendsContext);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<Set<string>>(new Set());
  const { socialRoom, tryConnectSocial } = useContext(SocialContext);
  const [requestCount, setRequestCount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const { id } = useContext(UserContext);

  const onFriendAccept = useCallback((otherId: ObjectId) => {
    setRequestCount(requestCount - 1);
    setFriends([...friendsRequestsData.current!.friendsData.friends]);
    if (!socialRoom) return;
    socialRoom.send("request:accept", otherId.toString());
  }, []);

  const onRemoveRequest = useCallback((otherId: ObjectId) => {
    setRequestCount(requestCount - 1);
    if (!socialRoom) return;
    socialRoom.send("request:remove", otherId.toString());
  }, []);

  const onRemoveFriend = useCallback(
    async (friendName: string, friendId: ObjectId) => {
      try {
        await removeFriend(friendName);
        setFriends([...friendsRequestsData.current!.friendsData.friends]);
        if (!socialRoom) return;
        socialRoom.send("friend:remove", friendId.toString());
      } catch (e) {
        if (e instanceof Error)
          console.error("could not remove friend", e.message);
      }
    },
    []
  );

  const loadPage = useCallback(async () => {
    setLoading(true);
    // db
    try {
      await tryGetFriends(true);
      setFriends([...friendsRequestsData.current!.friendsData.friends]);
      setRequestCount(friendsRequestsData.current!.requestsData.length);
    } catch (e) {
      if (e instanceof Error) setError(e.message);
    }
    // social
    if (client && !socialRoom && refresh) await tryConnectSocial(client);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    loadPage();
  }, [refresh]);

  useEffect(() => {
    loadPage();
  }, []);

  console.log("re render", requestCount);

  useEffect(() => {
    if (!socialRoom) return;
    socialRoom.removeAllListeners();

    // init
    socialRoom.onMessage("init", (state: SocialState) => {
      setOnlineFriends(new Set(state.users));
    });

    // connection event
    socialRoom.onMessage("connection", (userId: string) => {
      if (!isFriend(userId, friends)) return;
      onlineFriends.add(userId);
      setOnlineFriends(new Set(onlineFriends));
    });

    // disconnection event
    socialRoom.onMessage("disconnection", (userId: string) => {
      if (!isFriend(userId, friends)) return;
      onlineFriends.delete(userId);
      setOnlineFriends(new Set(onlineFriends));
    });

    socialRoom.onMessage("*", async (type, message) => {
      switch (type) {
        case "request:new":
        case "request:remove":
        case "friend:remove":
          console.log("REMOVE REQUEST", type);
          await tryGetFriends(false);
          loadPage();
          break;

        case "request:accept":
          console.log("REMOVE REQUEST", type);
          onlineFriends.add(message);
          setOnlineFriends(new Set(onlineFriends));
          await tryGetFriends(false);
          loadPage();
          break;

        default:
          break;
      }
    });
  }, [socialRoom, friends]);

  const mainClasses = "bg-slate-800 grow max-w-xs mx-auto h-full ";

  if (loading) {
    return (
      <section className={mainClasses + "flex justify-center"}>
        <LoadingPage />
      </section>
    );
  }

  if (error || !friendsRequestsData.current || !socialRoom) {
    return (
      <section className={mainClasses}>
        <div className="flex mt-2 items-center justify-center gap-4">
          <p className="text-lg font-semibold text-red-400">Disconnected</p>
          <button
            className={"" + (refresh && "animate-spin")}
            onClick={() => setRefresh(true)}
          >
            <FiRotateCw className="text-lg text-slate-300" strokeWidth={2.5} />
          </button>
        </div>
        <p className="mt-2 mx-2">
          Sorry, it seems we could not load the friends list..
        </p>
      </section>
    );
  }

  return (
    <section className={mainClasses}>
      <FriendTab
        expandedByDefault={false}
        title="Requests"
        notifCount={requestCount}
      >
        <FriendRequestsList
          key={requestCount}
          onFriendAccept={onFriendAccept}
          onRemoveRequest={onRemoveRequest}
        />
      </FriendTab>
      <FriendTab expandedByDefault={true} title="Friends">
        <ul className="mt-2">
          {friends
            .sort((friend) => {
              return onlineFriends.has(friend.user_id.toString()) ? -1 : 1;
            })
            .map((friend) => {
              const online = onlineFriends.has(friend.user_id.toString());
              return (
                <FriendUser
                  key={friend.user_id.toString()}
                  online={online}
                  friend={friend}
                  onRemoveFriend={onRemoveFriend}
                />
              );
            })}
        </ul>
      </FriendTab>
    </section>
  );
}

export default FriendList;
