import { StrictMode } from "react";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";
import AppButton from "../lib/AppButton";

// TODO: Headebar component

interface HomeProps {
  tryConnection: () => Promise<void>;
  tryLogout: () => Promise<void>;
  tryRemoveAccount: () => Promise<void>;
}

function Home({ tryConnection, tryLogout }: HomeProps) {
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />

        <main>
          <h1>Home</h1>
          <br />
          <AppButton color={"regular"} onClick={() => tryConnection()}>
            Play
          </AppButton>
        </main>

        <Footer />
      </div>
    </StrictMode>
  );
}

export default Home;
