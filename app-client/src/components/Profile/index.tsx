import { StrictMode } from "react";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import Navbar from "../Navbar";
import "./style.scss";

interface HomeProps {
  tryLogout: () => Promise<void>;
}

function Profile({ tryLogout }: HomeProps) {
  return (
    <StrictMode>
      <Navbar tryLogout={tryLogout} />
      <main>
        <h1>Profile</h1>
      </main>
      <Footer />
    </StrictMode>
  );
}

export default Profile;
