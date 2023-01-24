import { StrictMode, useCallback } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

// TODO: Headebar component

interface HomeProps {
  tryConnection: () => Promise<void>;
  tryLogout: () => Promise<void>;
  tryRemoveAccount: () => Promise<void>;
}

function Home({ tryConnection, tryLogout, tryRemoveAccount }: HomeProps) {
  return (
    <StrictMode>
      <header>
        <button onClick={tryLogout}>Disconnect</button>
        <button onClick={tryRemoveAccount}>Remove account</button>
      </header>

      <main>
        <h1>Home</h1>
        <Link to={"/profile"} className={"link"}>
          Profile
        </Link>
        <br />
        <button onClick={() => tryConnection()}>Play</button>
      </main>

      <footer>
        <Link to={"/privacy"} className={"link"}>
          Privacy Policy
        </Link>
        <Link to={"/acknowledgment"} className={"link"}>
          Acknowledgment
        </Link>
      </footer>
    </StrictMode>
  );
}

export default Home;
