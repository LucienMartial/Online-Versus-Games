import {
  Collection,
  ModifyResult,
  FindOneAndUpdateOptions,
  ObjectId,
  UpdateFilter,
} from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import { FriendRequest, Friends } from "../../app-shared/types/index.js";

export default function (
  friends: Collection<Friends>,
  requests: Collection<FriendRequest>
) {
  /**
   * Get friends and request, if it does not exist,
   * create a new one
   */
  async function getFriendsAndRequests(
    userId: ObjectId
  ): Promise<ModifyResult<Friends> | null> {
    try {
      const findQuerry = { _id: userId };
      const updateQuerry = {
        $setOnInsert: {
          _id: userId,
          friends: [],
          requests: [],
        } as UpdateFilter<Friends>,
      };
      const options: FindOneAndUpdateOptions = {
        upsert: true,
        returnDocument: "after",
      };
      return await friends.findOneAndUpdate(findQuerry, updateQuerry, options);
    } catch (e) {
      if (e instanceof Error)
        console.log("Could not get friends data", e.message);
      return null;
    }
  }

  async function addFriendRequest(): Promise<boolean> {
    return false;
  }

  async function removeFriendRequest(): Promise<boolean> {
    return false;
  }

  async function acceptFriendRequest(): Promise<boolean> {
    return false;
  }

  async function removeFriend(): Promise<boolean> {
    return false;
  }

  return {
    getFriendsAndRequests,
    addFriendRequest,
    removeFriendRequest,
    acceptFriendRequest,
    removeFriend,
  };
}
