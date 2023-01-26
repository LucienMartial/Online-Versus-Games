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
      <HistoryList games={history} username={username} />
    </StrictMode>
  );
}

export default History;
