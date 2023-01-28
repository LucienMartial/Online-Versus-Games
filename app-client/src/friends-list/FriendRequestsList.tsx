import { ObjectId, WithId } from "mongodb";
import { useCallback, useContext, useEffect, useState } from "react";
import { Friend, FriendRequest } from "../../../app-shared/types";
import { FriendsContext, UserContext } from "../App";
import AppButton from "../components/lib/AppButton";
import Request from "./Request";

interface FriendRequestsListProps {
  onFriendAccept: () => void;
}

function FriendRequestsList({ onFriendAccept }: FriendRequestsListProps) {
  const { friendsRequestsData, removeFriendRequest, acceptFriendRequest } =
    useContext(FriendsContext);
  const { id } = useContext(UserContext);
  const [requests, setRequest] = useState<WithId<FriendRequest>[]>([]);

  const removeRequest = useCallback(async (requestId: ObjectId) => {
    try {
      await removeFriendRequest(requestId);
      setRequest([...friendsRequestsData.current!.requestsData]);
    } catch (e) {
      console.error("could not remove specified request", requestId);
    }
  }, []);

  const acceptRequest = useCallback(async (request: WithId<FriendRequest>) => {
    try {
      await acceptFriendRequest(request);
      setRequest([...friendsRequestsData.current!.requestsData]);
      onFriendAccept();
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
      console.error("could not accept specified request", request._id);
    }
  }, []);

  useEffect(() => {
    setRequest([...friendsRequestsData.current!.requestsData]);
  }, []);

  return (
    <section>
      <ul className="flex flex-col justify-center">
        {requests.map((request) => {
          return (
            <Request
              key={request._id.toString()}
              request={request}
              userId={id}
              removeRequest={removeRequest}
              acceptRequest={acceptRequest}
            />
          );
        })}
      </ul>
    </section>
  );
}

export default FriendRequestsList;
