import { StrictMode } from "react";
import { Link } from "react-router-dom";
import "./style.scss";

interface HomeProps {
  tryConnection: () => Promise<void>;
}

function Home({ tryConnection }: HomeProps) {
  return (
    <StrictMode>
      <main>
        <h1>Home</h1>
        <button onClick={() => tryConnection()}>Play</button>
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

export default Home;
