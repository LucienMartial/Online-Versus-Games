import { StrictMode } from "react";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";
import AppButton from "../lib/AppButton";
import FriendList from "../../friends-list/FriendList";
import { Client } from "colyseus.js";

// TODO: Headebar component

interface HomeProps {
  tryConnection: () => Promise<void>;
  tryLogout: () => Promise<void>;
  client: Client | undefined;
}

function Home({ tryConnection, tryLogout, client }: HomeProps) {
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />

        <main className="flex grow">
          <section className="grow">
            <h1>Game</h1>
            <AppButton color={"regular"} onClick={() => tryConnection()}>
              Play
            </AppButton>
          </section>
          <FriendList client={client} />
        </main>

        <Footer />
      </div>
    </StrictMode>
  );
}

export default Home;
