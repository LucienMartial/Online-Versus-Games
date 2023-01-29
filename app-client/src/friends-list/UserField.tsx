import { useNavigate } from "react-router-dom";
import { FiUser } from "react-icons/fi";

function UserField({ username }: { username: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-1.5 ml-1">
      <button className="text-lg" onClick={() => navigate("/user/" + username)}>
        <FiUser />
      </button>
      <p className="font-semibold">{username}</p>
    </div>
  );
}

export default UserField;
