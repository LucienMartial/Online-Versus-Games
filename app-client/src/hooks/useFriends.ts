import { MutableRefObject, useCallback, useRef } from "react";
import { Friends } from "../../../app-shared/types";

/**
 * Utils
 */

async function fetchFriends(): Promise<Friends | Error> {
  const res = await fetch("/api/friends", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (res.status !== 200) return data as Error;
  return data as Friends;
}

async function postRequest(path: string, body: {}): Promise<Response | Error> {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (res.status === 200) return res;
  const error: Error = await res.json();
  return error;
}

/**
 * Manage a cache for the friends data, update it if needed
 */

interface useFriendsRes {
  friendsData: MutableRefObject<Friends | null>;
  tryGetFriends: () => Promise<void>;
}

function useFriends(): useFriendsRes {
  const friendsData = useRef<Friends | null>(null);

  const tryGetFriends = useCallback(async () => {
    if (friendsData.current) {
      console.log("Avoid loading, users already cached");
      return;
    }
    const res = await fetchFriends();
    if (res instanceof Error) throw new Error(res.message);
    friendsData.current = res;
  }, []);

  return { friendsData, tryGetFriends };
}

export default useFriends;
export type { useFriendsRes };
