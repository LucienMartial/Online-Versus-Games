import { StrictMode, useCallback, useEffect, useState } from "react";
import AppLink from "../lib/AppLink";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";
import { Game } from "../../../../app-shared/types";
import { useParams } from "react-router-dom";
import HistoryList from "./HistoryList";

interface HomeProps {
  tryLogout: () => Promise<void>;
}

function History({ tryLogout }: HomeProps) {
  const { username = " " } = useParams();
  const [history, setHistory] = useState<Game[]>([]);
  const [error, setError] = useState<null | string>(null);

  const getHistory = useCallback(async () => {
    const res = await fetch("/api/history/" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    if (res.status === 404) {
      setError("No user specified");
      return;
    }
    if (res.status !== 200) {
      const error: Error = await res.json();
      setError(error.message);
      return;
    }
    // success
    const games = await res.json();
    setHistory(games);
  }, []);

  useEffect(() => {
    getHistory();
  }, []);

  if (error) {
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
              <p>Sorry, it seems we could not load the historic..</p>
              <p>Server error: {error}</p>
            </section>
          </main>
          <Footer />
        </div>
      </StrictMode>
    );
  }

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
            <h1>History</h1>
            <HistoryList games={history} username={username} />
          </section>
        </main>
        <Footer />
      </div>
    </StrictMode>
  );
}

export default History;
