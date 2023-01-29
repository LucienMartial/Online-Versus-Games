import { ObjectId, WithId } from "mongodb";
import { MutableRefObject, useCallback, useRef } from "react";
import {
  FriendRequest,
  FriendsRequestsData,
  RequestTarget,
  UserTarget,
} from "../../../app-shared/types";

/**
 * Utils
 */

async function fetchFriendsRequests(): Promise<FriendsRequestsData | Error> {
  const res = await fetch("/api/friends", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (res.status !== 200) return data as Error;
  return data as FriendsRequestsData;
}

async function postRequest(path: string, body: {}): Promise<Response | string> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 200) return res;
  const error: Error = await res.json();
  return error.message;
}

/**
 * Manage a cache for the friends data, update it if needed
 */

interface useFriendsRes {
  friendsRequestsData: MutableRefObject<FriendsRequestsData | null>;
  tryGetFriends: (cached: boolean) => Promise<void>;
  sendFriendRequest: (otherName: string) => Promise<string>;
  removeFriendRequest: (requestId: ObjectId) => Promise<void>;
  acceptFriendRequest: (request: WithId<FriendRequest>) => Promise<void>;
  removeFriend: (friendName: string) => Promise<void>;
  destroy: () => void;
}

function useFriends(): useFriendsRes {
  const friendsRequestsData = useRef<FriendsRequestsData | null>(null);

  // fetch data

  const tryGetFriends = useCallback(async (cached: boolean) => {
    if (friendsRequestsData.current && cached) {
      console.log("Avoid loading, users already cached");
      return;
    }
    const res = await fetchFriendsRequests();
    if (res instanceof Error) throw new Error(res.message);
    friendsRequestsData.current = res;
  }, []);

  // send friend request

  const sendFriendRequest = useCallback(
    async (otherName: string): Promise<string> => {
      if (!friendsRequestsData.current) await tryGetFriends(true);
      const body: UserTarget = { username: otherName };
      const res = await postRequest("/api/friends/request-add", body);
      if (!(res instanceof Response)) throw new Error(res);
      const data: WithId<FriendRequest> = await res.json();
      friendsRequestsData.current?.requestsData.push(data);
      return data.recipient.toString();
    },
    []
  );

  // accept friend request

  const acceptFriendRequest = useCallback(
    async (request: WithId<FriendRequest>) => {
      const body: RequestTarget = { id: request._id };
      const res = await postRequest("/api/friends/request-accept", body);
      if (!(res instanceof Response)) throw new Error(res);
      console.log("Request successfuly accepted", request._id);
      if (!friendsRequestsData.current) return;
      const index = friendsRequestsData.current.requestsData.findIndex(
        (req) => req._id === request._id
      );
      if (index !== -1) {
        friendsRequestsData.current!.requestsData.splice(index, 1);
      }
      friendsRequestsData.current.friendsData.friends.push({
        user_id: request.expeditor,
        username: request.expeditorName,
      });
    },
    []
  );

  // remove friend request

  const removeFriendRequest = useCallback(async (requestId: ObjectId) => {
    const body: RequestTarget = { id: requestId };
    const res = await postRequest("/api/friends/request-remove", body);
    if (!(res instanceof Response)) throw new Error(res);
    console.log("Request successfuly removed", requestId);
    if (!friendsRequestsData.current) return;
    const index = friendsRequestsData.current.requestsData.findIndex(
      (req) => req._id === requestId
    );
    if (index !== -1) {
      friendsRequestsData.current!.requestsData.splice(index, 1);
    }
  }, []);

  // remove friend from friend list

  const removeFriend = useCallback(async (friendName: string) => {
    const body: UserTarget = { username: friendName };
    const res = await postRequest("/api/friends/remove", body);
    if (!(res instanceof Response)) throw new Error(res);
    if (!friendsRequestsData.current) return;
    const index = friendsRequestsData.current.friendsData.friends.findIndex(
      (friend) => friend.username === friendName
    );
    if (index !== -1) {
      friendsRequestsData.current!.friendsData.friends.splice(index, 1);
    }
  }, []);

  const destroy = useCallback(() => {
    friendsRequestsData.current = null;
  }, []);

  return {
    friendsRequestsData,
    tryGetFriends,
    sendFriendRequest,
    removeFriendRequest,
    acceptFriendRequest,
    removeFriend,
    destroy,
  };
}

export default useFriends;
export type { useFriendsRes };
