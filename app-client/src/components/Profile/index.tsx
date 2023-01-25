import { StrictMode } from "react";
import Footer from "../Footer";
import Navbar from "../Navbar";
import "./style.scss";

interface HomeProps {
  tryLogout: () => Promise<void>;
}

function Profile({ tryLogout }: HomeProps) {
  return (
    <StrictMode>
        <div className="flex flex-col h-screen w-screen justify-between">
      <Navbar tryLogout={tryLogout} />
      <main>
        <h1>Profile</h1>
      </main>
      <Footer />
    </div>
    </StrictMode>
  );
}

export default Profile;
