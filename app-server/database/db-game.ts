import { Collection } from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import { AppError } from "../utils/error.js";

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

  // for speciefied username, return the most recent games
  async function getGames(
    username: string,
    skip: number,
    limit: number
  ): Promise<Game[]> {
    try {
      const querry = { players: { $elemMatch: { username: username } } };
      const result = await games
        .find(querry)
        .limit(limit)
        .skip(skip)
        .sort({ timestamp: -1 });
      return result.toArray();
    } catch (e) {
      if (e instanceof Error)
        console.log("game fetching error for user ", username, e.message);
      throw new AppError(500, "Error while fetching game");
    }
  }

  return { createGame, getGames };
}

export type { Game };
