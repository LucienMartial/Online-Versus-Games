import { StrictMode, useContext } from "react";
import AppLink from "../lib/AppLink";

function EndGamePlayer(
  username: string,
  death: number,
  shots: number,
  counters: number
) {
  return (
    <tr className="group hover:bg-slate-800">
      <td className="text-left py-6">
        <div className="flex">
          <span className="border-l-4 -mt-6 -mb-6 border-blue-900 group-hover:border-blue-400"></span>
          <AppLink to="profile">
            <span className="ml-4">👤</span>
          </AppLink>
          <span className="ml-4">{username}</span>
        </div>
      </td>
      <td>{death}</td>
      <td>{shots}</td>
      <td>{counters}</td>
    </tr>
  );
}

function EndGame() {
  const victory = true;

  return (
    <StrictMode>
      <div className="flex flex-col w-screen justify-between items-center my-12">
        <h1 className="text-6xl pt-5">{victory ? "Victory" : "Defeat"}</h1>
        <section className="transition-all container p-4 my-8">
          <table className="w-full table-fixed border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="px-2 py-1 w-3/6 text-left">Players</th>
                <th>Death</th>
                <th>Shots</th>
                <th>Counters</th>
              </tr>
            </thead>
            <tbody>
              {EndGamePlayer("Riwan", 3, 10, 970)}
              {EndGamePlayer("SuperLongUsername", 1, 2000, 8)}
            </tbody>
          </table>
        </section>
        <section className="grow">Chat</section>
        <button>Leave</button>
      </div>
    </StrictMode>
  );
}

export default EndGame;
