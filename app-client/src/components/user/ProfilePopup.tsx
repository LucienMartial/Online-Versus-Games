import { Dispatch, StrictMode } from "react";
import Profile from "./ProfileView";
import { FiArrowLeftCircle } from "react-icons/fi";

interface UserProps {
  username: string;
  setProfileUsername: Dispatch<React.SetStateAction<null | string>>;
}

function ProfilePopup({ username, setProfileUsername }: UserProps) {
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <header className="flex pl-4 pt-2">
          <button
            onClick={() => setProfileUsername(null)}
            className="hover:scale-110 transition-all duration-75"
          >
            <FiArrowLeftCircle size={30} />
          </button>
        </header>
        <Profile username={username} />
      </div>
    </StrictMode>
  );
}

export default ProfilePopup;
