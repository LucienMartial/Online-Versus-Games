import { ObjectId } from "mongodb";
import { Collection } from "mongodb";
import { Profile } from "../../app-shared/types/db-types.js";

export default function (profiles: Collection<Profile>) {
  async function getProfile(userId: ObjectId): Promise<Profile | null> {
    try {
      return await profiles.findOne({ _id: userId });
    } catch (e) {
      if (e instanceof Error) console.log("profile get error", e.message);
      return null;
    }
  }

  return { getProfile };
}
