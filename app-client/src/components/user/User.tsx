import { useParams } from "react-router-dom";
import { StrictMode } from "react";
import Profile from "./ProfileView";
import useTitle from "../../hooks/useTitle";

// import { UserContext } from "../../App";

interface UserProps {
  tryRemoveAccount: () => Promise<void>;
}

export default function User({ tryRemoveAccount }: UserProps) {
  const { username = " " } = useParams();
  useTitle(username + " - Online Versus Games");
  return (
    <StrictMode>
      <Profile username={username} handleRemoveAccount={tryRemoveAccount} />
    </StrictMode>
  );
}
