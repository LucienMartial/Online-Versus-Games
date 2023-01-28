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
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />
        <Profile
          username={username}
          isUser={true}
          handleRemoveAccount={tryRemoveAccount}
        />
        <Footer />
      </div>
    </StrictMode>
  );
}
