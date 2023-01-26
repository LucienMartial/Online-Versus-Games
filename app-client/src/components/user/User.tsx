import { useParams } from "react-router-dom";
import { StrictMode } from "react";
import Navbar from "../lib/Navbar";
import Footer from "../lib/Footer";
import Profile from "./Profile";

interface UserProps {
  tryLogout: () => Promise<void>;
}

export default function User({ tryLogout }: UserProps) {
  const { username = " " } = useParams();
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />
        <Profile username={username} />
        <Footer />
      </div>
    </StrictMode>
  );
}
