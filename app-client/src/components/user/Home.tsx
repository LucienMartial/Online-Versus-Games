import { StrictMode } from "react";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";
import AppButton from "../lib/AppButton";
import FriendList from "../../friends-list/FriendList";

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

        <main className="flex grow">
          <section className="grow">
            <h1>Game</h1>
            <AppButton color={"regular"} onClick={() => tryConnection()}>
              Play
            </AppButton>
          </section>
          <FriendList />
        </main>

        <Footer />
      </div>
    </StrictMode>
  );
}

export default Home;
