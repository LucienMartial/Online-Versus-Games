import { Collection } from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";

interface Game {
  timestamp: Date;
  players: GamePlayer[];
}

interface GamePlayer {
  username: string;
  deathCount: number;
  victory: boolean;
}

export default function (games: Collection<Game>) {
  async function getGames() {}

  async function createGame(state: EndGameState): Promise<void> {
    try {
      // insert game
      const players: GamePlayer[] = [];
      state.players.forEach((state, id) => {
        players.push({
          username: state.username,
          deathCount: state.deathCounter,
          victory: state.victory,
        });
      });
      const res = await games.insertOne({
        timestamp: new Date(),
        players: players,
      });
      console.log("A game was inserted with the _id", res.insertedId);
    } catch (e) {
      if (e instanceof Error) console.log("game creation error", e.message);
    }
  }

  return { createGame };
}

export type { Game };
