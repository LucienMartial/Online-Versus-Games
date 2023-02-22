import { ObjectId } from "mongodb";
import { Collection } from "mongodb";
import {
  EndGamePlayerState,
} from "../../../app-shared/disc-war/state/index.js";
import { DiscWarStats } from "../../../app-shared/disc-war/types.js";
import { Profile } from "../../../app-shared/types/db-types.js";

export default function (profiles: Collection<Profile<DiscWarStats>>) {
  async function getProfile(
    userId: ObjectId,
  ): Promise<Profile<DiscWarStats> | null> {
    try {
      const res = await profiles.findOneAndUpdate(
        { _id: userId },
        {
          $setOnInsert: {
            games: 0,
            wins: 0,
            stats: {
              deaths: 0,
              kills: 0,
              dashes: 0,
              lineShots: 0,
              curveShots: 0,
              shields: 0,
              shieldCatches: 0,
            },
          } satisfies Profile<DiscWarStats>,
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

  async function updateProfile(
    userId: ObjectId,
    profile: Profile<DiscWarStats>,
    state: EndGamePlayerState,
  ): Promise<boolean> {
    try {
      profile.games += 1;
      if (state.victory) profile.wins += 1;
      profile.stats.deaths += state.stats.deaths;
      profile.stats.kills += state.stats.kills;
      profile.stats.dashes += state.stats.dashes;
      profile.stats.lineShots += state.stats.straightShots;
      profile.stats.curveShots += state.stats.curveShots;
      profile.stats.shields += state.stats.shields;
      profile.stats.shieldCatches += state.stats.shieldCatches;
      const res = await profiles.updateOne({ _id: userId }, { $set: profile });
      return res.modifiedCount === 1;
    } catch (e) {
      if (e instanceof Error) console.log("profile update error", e.message);
      return false;
    }
  }

  return { getProfile, updateProfile };
}
