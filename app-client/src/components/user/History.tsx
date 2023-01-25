import { StrictMode, useCallback, useEffect, useState } from "react";
import AppLink from "../lib/AppLink";
import Footer from "../lib/Footer";
import Navbar from "../lib/Navbar";
import { Game, GamePlayer } from "../../../../app-shared/types";

interface HomeProps {
  tryLogout: () => Promise<void>;
}

function HistoryGame(game: Game) {
  return (
    <li key={game.timestamp.toString()}>
      <div>{game.timestamp.toString()}</div>
      {game.players.map((player: GamePlayer) => {})}
    </li>
  );
}

function History({ tryLogout }: HomeProps) {
  // TODO: use context
  const username = "riwan";
  const [history, setHistory] = useState<Game[]>([]);
  const [error, setError] = useState<null | string>(null);

  const getHistory = useCallback(async () => {
    const res = await fetch("/api/history/" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // failed
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
              <p>
                Sorry, it seems we could not load the historic of {username}
              </p>
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
            <ul>{history.map(HistoryGame)}</ul>
          </section>
        </main>
        <Footer />
      </div>
    </StrictMode>
  );
}

export default History;
