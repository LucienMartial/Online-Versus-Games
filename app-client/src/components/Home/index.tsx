import { StrictMode } from "react";
import "./style.scss";

interface HomeProps {
  tryConnection: () => Promise<void>;
}

function Home({ tryConnection }: HomeProps) {
  return (
    <StrictMode>
      <>
        <h1>Home</h1>
        <button onClick={() => tryConnection()}>GAME</button>
      </>
    </StrictMode>
  );
}

export default Home;
