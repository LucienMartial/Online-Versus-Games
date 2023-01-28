import { useNavigate } from "react-router-dom";
import { Friend } from "../../../app-shared/types";
import { FiUser } from "react-icons/fi";

function FriendUser({ friend }: { friend: Friend }) {
  const navigate = useNavigate();
  return (
    <li
      key={friend.user_id.toString()}
      className="flex gap-2 px-1 py-3 mt-1 mx-4 bg-slate-900"
    >
      <button
        className="ml-4 text-lg"
        onClick={() => navigate("/user/" + friend.username)}
      >
        <FiUser />
      </button>
      <p>{friend.username}</p>
    </li>
  );
}

export default FriendUser;
