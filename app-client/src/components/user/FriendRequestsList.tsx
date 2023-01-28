import { ObjectId, WithId } from "mongodb";
import { useCallback, useContext, useEffect, useState } from "react";
import { Friend, FriendRequest } from "../../../../app-shared/types";
import { FriendsContext, UserContext } from "../../App";
import AppButton from "../lib/AppButton";

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
      <h2 className="text-3xl">Requests</h2>
      <ul className="flex justify-center">
        {requests.map((request) => {
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
                    <AppButton
                      color="regular"
                      onClick={() => acceptRequest(request)}
                    >
                      Accept
                    </AppButton>
                    <AppButton
                      color="regular"
                      onClick={() => removeRequest(request._id)}
                    >
                      Refuse
                    </AppButton>
                  </div>
                )}
                {!received && (
                  <AppButton
                    color="regular"
                    onClick={() => removeRequest(request._id)}
                  >
                    Cancel
                  </AppButton>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default FriendRequestsList;
