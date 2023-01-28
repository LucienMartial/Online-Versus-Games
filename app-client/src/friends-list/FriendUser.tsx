import { Friend } from "../../../app-shared/types";
import { FiXCircle } from "react-icons/fi";
import UserField from "./UserField";

function FriendUser({
  friend,
  onRemoveFriend,
}: {
  friend: Friend;
  onRemoveFriend: (friendName: string) => Promise<void>;
}) {
  return (
    <li className="flex justify-between px-2 py-3 mt-1 mx-4 bg-slate-900">
      <UserField username={friend.username} />
      <button
        className="text-lg mr-1"
        onClick={() => onRemoveFriend(friend.username)}
      >
        <FiXCircle />
      </button>
    </li>
  );
}

export default FriendUser;
