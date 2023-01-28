import { MutableRefObject, useCallback, useRef } from "react";
import {
  FriendRequest,
  FriendsRequestsData,
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
  tryGetFriends: () => Promise<void>;
  sendFriendRequest: (otherName: string) => Promise<void>;
}

function useFriends(): useFriendsRes {
  const friendsRequestsData = useRef<FriendsRequestsData | null>(null);

  const tryGetFriends = useCallback(async () => {
    if (friendsRequestsData.current) {
      console.log("Avoid loading, users already cached");
      return;
    }
    const res = await fetchFriendsRequests();
    if (res instanceof Error) throw new Error(res.message);
    friendsRequestsData.current = res;
  }, []);

  const sendFriendRequest = useCallback(async (otherName: string) => {
    if (!friendsRequestsData.current) await tryGetFriends();
    const body: UserTarget = { username: otherName };
    const res = await postRequest("/api/friends/request-add", body);
    if (!(res instanceof Response)) throw new Error(res);
    const data: FriendRequest = await res.json();
    friendsRequestsData.current?.requestsData.push(data);
    console.log("REQUEST ID", friendsRequestsData.current);
  }, []);

  return { friendsRequestsData, tryGetFriends, sendFriendRequest };
}

export default useFriends;
export type { useFriendsRes };
