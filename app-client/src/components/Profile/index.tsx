import { StrictMode } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

function Profile() {
  return (
    <StrictMode>
      <main>
        <h1>Profile</h1>
        <Link to={"/home"} className={"link"}>
          Back to home
        </Link>
        <footer>
          <Link to={"/privacy"} className={"link"}>
            Privacy Policy
          </Link>
          <Link to={"/acknowledgment"} className={"link"}>
            Acknowledgment
          </Link>
        </footer>
      </main>
    </StrictMode>
  );
}

export default Profile;
