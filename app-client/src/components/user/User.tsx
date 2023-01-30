import { useParams } from "react-router-dom";
import { StrictMode, useContext } from "react";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";
import Profile from "./Profile";

// import { UserContext } from "../../App";

interface UserProps {
  tryRemoveAccount: () => Promise<void>;
}

export default function User({ tryRemoveAccount }: UserProps) {
  const { username = " " } = useParams();
  return (
    <StrictMode>
      <Profile username={username} handleRemoveAccount={tryRemoveAccount} />
    </StrictMode>
  );
}
