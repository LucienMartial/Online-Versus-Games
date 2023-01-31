import { Collection, ObjectId } from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import { AppError } from "../utils/error.js";
import { Game, GamePlayer } from "../../app-shared/types/index.js";

export default function (games: Collection<Game>) {
  async function createGame(state: EndGameState): Promise<void> {
    try {
      // insert game
      const players: GamePlayer[] = [];
      state.players.forEach((state) => {
        players.push({
          user_id: new ObjectId(state.id),
          username: state.username,
          victory: state.victory,
          stats: {
            deaths: state.deaths,
            kills: state.kills,
            lineShots: state.straightShots,
            curveShots: state.curveShots,
            shields: state.shields,
            shieldCatches: state.shieldCatches,
            dashes: state.dashes,
          },
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
    id: ObjectId,
    skip: number,
    limit: number
  ): Promise<Game[]> {
    try {
      const querry = { players: { $elemMatch: { user_id: id } } };
      const result = await games
        .find(querry)
        .limit(limit)
        .skip(skip)
        .sort({ timestamp: -1 });
      return result.toArray();
    } catch (e) {
      if (e instanceof Error)
        console.log("game fetching error for user ", id, e.message);
      throw new AppError(500, "Error while fetching game");
    }
  }

  return { createGame, getGames };
}
