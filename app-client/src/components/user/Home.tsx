import { StrictMode } from "react";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";

// TODO: Headebar component

interface HomeProps {
  tryConnection: () => Promise<void>;
  tryLogout: () => Promise<void>;
  tryRemoveAccount: () => Promise<void>;
}

function Home({ tryConnection, tryLogout, tryRemoveAccount }: HomeProps) {
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />
        {/* <button onClick={tryRemoveAccount}>Remove account</button> */}

        <main>
          <h1>Home</h1>
          <br />
          <button onClick={() => tryConnection()}>Play</button>
        </main>

        <Footer />
      </div>
    </StrictMode>
  );
}

export default Home;
