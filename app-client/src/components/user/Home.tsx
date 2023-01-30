import { StrictMode } from "react";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";
import AppButton from "../lib/AppButton";
import FriendList from "../../friends-list/FriendList";
import { Client } from "colyseus.js";

interface HomeProps {
  tryConnection: () => Promise<void>;
  client: Client | undefined;
}

function Home({ tryConnection, client }: HomeProps) {
  return (
    <StrictMode>
      <main className="flex grow">
        <section className="grow">
          <h1>Game</h1>
          <AppButton color={"regular"} onClick={() => tryConnection()}>
            Play
          </AppButton>
        </section>
        <FriendList client={client} />
      </main>
    </StrictMode>
  );
}

export default Home;
