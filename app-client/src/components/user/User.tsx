import { useParams } from "react-router-dom";
import { StrictMode, useContext } from "react";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";
import Profile from "./Profile";
import { UserContext } from "../../App";

interface UserProps {
  tryLogout: () => Promise<void>;
  tryRemoveAccount: () => Promise<void>;
}

export default function User({ tryLogout, tryRemoveAccount }: UserProps) {
  const { username = " " } = useParams();
  const connectedUser = useContext(UserContext);
  const isUser = connectedUser === username;
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />
        <Profile
          username={username}
          isUser={isUser}
          handleRemoveAccount={tryRemoveAccount}
        />
        <Footer />
      </div>
    </StrictMode>
  );
}
