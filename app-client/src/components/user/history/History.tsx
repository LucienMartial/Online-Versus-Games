import { useCallback, useEffect, useState } from "react";
import { DiscWarStats } from "../../../../../app-shared/disc-war/types";
import { Game } from "../../../../../app-shared/types";
import LoadingPage from "../../LoadingPage";
import HistoryList from "./HistoryList";

interface HistoryProps {
  username: string;
}

function History({ username }: HistoryProps) {
  const [history, setHistory] = useState<Game<DiscWarStats>[] | null>(null);
  const [error, setError] = useState<null | string>(null);

  const getHistory = useCallback(async () => {
    const res = await fetch("/api/history/" + username, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
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
  }, [username]);

  useEffect(() => {
    getHistory();
  }, [username]);

  if (!history) {
    return (
      <section className="grow flex justify-center item-center ">
        <LoadingPage />
      </section>
    );
  }

  if (error) {
    return (
      <section className="grow flex justify-center item-center ">
        <p>Sorry, it seems we could not load the historic..</p>
        <p>Server error: {error}</p>
      </section>
    );
  }

  return (
    <>
      {history.length > 0 && (
        <HistoryList
          games={history}
          username={username}
        />
      )}
      {history.length === 0 && (
        <div className="flex flex-col grow justify-center">
          <h2 className="text-2xl">No games yet..</h2>
        </div>
      )}
    </>
  );
}

export default History;
