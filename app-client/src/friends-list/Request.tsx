import { ObjectId } from "mongodb";
import { WithId } from "mongodb";
import { FriendRequest } from "../../../app-shared/types";
import { FiX, FiCheck } from "react-icons/fi";
import UserField from "./UserField";

function Request({
  request,
  userId,
  removeRequest,
  acceptRequest,
}: {
  request: WithId<FriendRequest>;
  userId: ObjectId;
  removeRequest: (requestId: ObjectId) => Promise<void>;
  acceptRequest: (request: WithId<FriendRequest>) => Promise<void>;
}) {
  const received = request.recipient === userId;
  const target = received ? request.expeditorName : request.recipientName;

  return (
    <li className="w-full px-4">
      <div className="flex items-center justify-between mt-1 px-2 py-2 text-lg bg-slate-900">
        <UserField username={target} />
        <div className="text-xl flex items-center gap-2">
          {received && (
            <button
              className="select-none"
              onClick={() => acceptRequest(request)}
            >
              <FiCheck />
            </button>
          )}
          <button
            className="select-none"
            onClick={() => removeRequest(request._id)}
          >
            <FiX />
          </button>
        </div>
      </div>
    </li>
  );
}

export default Request;
