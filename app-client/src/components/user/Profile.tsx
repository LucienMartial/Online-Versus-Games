import { StrictMode } from "react";
import AppLink from "../lib/AppLink";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";

interface HomeProps {
  tryLogout: () => Promise<void>;
}

function Profile({ tryLogout }: HomeProps) {
  return (
    <StrictMode>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Navbar tryLogout={tryLogout} />
        <main className="grow">
          <div className="p-4 border-2 border-slate-800 divide-x-2 divide-slate-700 grid grid-cols-2">
            <AppLink to="/profile">Profile</AppLink>
            <AppLink to="/history">History</AppLink>
          </div>
          <section className="mt-4">
            <h1>Profile</h1>
          </section>
        </main>
        <Footer />
      </div>
    </StrictMode>
  );
}

export default Profile;
