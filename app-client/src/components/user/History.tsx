import { StrictMode, useCallback, useEffect, useState } from "react";
import { Game } from "../../../../app-shared/types";
import HistoryList from "./HistoryList";

interface HistoryProps {
  username: string;
}

function History({ username }: HistoryProps) {
  const [history, setHistory] = useState<Game[]>([]);
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

  if (error) {
    return (
      <StrictMode>
        <p>Sorry, it seems we could not load the historic..</p>
        <p>Server error: {error}</p>
      </StrictMode>
    );
  }

  return (
    <StrictMode>
      {history.length > 0 && (
        <HistoryList games={history} username={username} />
      )}
      {history.length === 0 && (
        <div className="flex flex-col grow justify-center">
          <h2 className="text-2xl">No games yet..</h2>
        </div>
      )}
    </StrictMode>
  );
}

export default History;
