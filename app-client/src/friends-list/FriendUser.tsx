import { Friend } from "../../../app-shared/types";
import { FiXCircle } from "react-icons/fi";
import UserField from "./UserField";
import { ObjectId } from "mongodb";

function FriendUser({
  friend,
  onRemoveFriend,
  online,
}: {
  friend: Friend;
  onRemoveFriend: (friendName: string, friendId: ObjectId) => Promise<void>;
  online: boolean;
}) {
  return (
    <li className="flex items-center justify-between px-2 py-3 mt-1 mx-4 bg-slate-900">
      <div className="flex ml-1 items-center gap-2">
        <span
          className={
            "w-2.5 h-2.5 rounded-full " +
            (online ? "bg-green-500" : "bg-red-800")
          }
        ></span>
        <UserField username={friend.username} />
      </div>
      <button
        className="text-lg mr-1"
        onClick={() => onRemoveFriend(friend.username, friend.user_id)}
      >
        <FiXCircle />
      </button>
    </li>
  );
}

export default FriendUser;
