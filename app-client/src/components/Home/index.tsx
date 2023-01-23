import { StrictMode } from "react";
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
      </main>
    </StrictMode>
  );
}

export default Home;
