// TODO: Headebar component

import { useCallback, useEffect, useState } from "react";

interface FriendListProps {}

function FriendList({}: FriendListProps) {
  const [error, setError] = useState<string | null>(null);

  // fetch data from server
  const loadFriendList = useCallback(async () => {
    console.log("load friends");
    const res = await fetch("/api/friends", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status !== 200) {
      const error: Error = await res.json();
      setError(error.message);
      return;
    }
    const data = await res.json();
    console.log(data);
  }, []);

  useEffect(() => {
    loadFriendList();
    return () => {
      console.log("remove friends");
    };
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
