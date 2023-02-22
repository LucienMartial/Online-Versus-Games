import { Collection, Db, ObjectId } from "mongodb";
import { Game, Profile } from "../../app-shared/types/db-types.js";
import { AppError } from "../utils/error.js";

class DatabaseGame<S> {
  games: Collection<Game<S>>;
  profiles: Collection<Profile<S>>;

  constructor(
    db: Db,
    gamesCollection: string,
    profilesCollection: string,
  ) {
    this.games = db.collection(gamesCollection);
    this.profiles = db.collection(profilesCollection);
  }

  // games
  async createGame(
    endState: {
      players: Map<
        string,
        { username: string; victory: boolean; id: string; stats: any }
      >;
    },
  ): Promise<void> {
    try {
      const players = [];
      endState.players.forEach((state) => {
        players.push({
          user_id: new ObjectId(state.id),
          username: state.username,
          victory: state.victory,
          stats: state.stats,
        });
      });
      const res = await this.games.insertOne({
        timestamp: new Date(),
        players: players,
      });
      console.log("A game was inserted with the _id", res.insertedId);
    } catch (e) {
      if (e instanceof Error) console.log("game creation error", e.message);
    }
  }

  async getGames(
    id: ObjectId,
    skip: number,
    limit: number,
  ): Promise<Game<S>[]> {
    try {
      const querry = { players: { $elemMatch: { user_id: id } } };
      const result = await (this.games as any)
        .find(querry)
        .limit(limit)
        .skip(skip)
        .sort({ timestamp: -1 });
      return result.toArray();
    } catch (e) {
      if (e instanceof Error) {
        console.log("game fetching error for user ", id, e.message);
      }
      throw new AppError(500, "Error while fetching game");
    }
  }

  // profiles
  async getProfile(
    userId: ObjectId,
    defaultStats: S,
  ): Promise<Profile<S> | null> {
    try {
      // typescript why?
      const res = await (this.profiles as Collection<any>).findOneAndUpdate(
        { _id: userId },
        {
          $setOnInsert: {
            games: 0,
            wins: 0,
            stats: defaultStats,
          } satisfies Profile<S>,
        },
        {
          upsert: true,
          returnDocument: "after",
        },
      );
      if (res.ok) return res.value;
      return null;
    } catch (e) {
      if (e instanceof Error) console.log("profile get error", e.message);
      return null;
    }
  }

  async updateProfile(
    userId: ObjectId,
    profile: Profile<S>,
    victory: boolean,
    stats: S,
  ): Promise<boolean> {
    try {
      profile.games += 1;
      if (victory) profile.wins += 1;
      for (const key in profile.stats) {
        profile.stats[key] += stats[key] as any;
      }
      // typescript why do you an error with generic collection?
      const res = await (this.profiles as Collection<any>).updateOne({
        _id: userId,
      }, {
        $set: profile,
      });
      return res.modifiedCount === 1;
    } catch (e) {
      if (e instanceof Error) console.log("profile update error", e.message);
      return false;
    }
  }
}

export { DatabaseGame };
