import { Collection, ObjectId, UpdateFilter, WithId } from "mongodb";
import {
  Friend,
  FriendRequest,
  Friends,
  FriendsRequestsData,
} from "../../app-shared/types/index.js";
import { AppError } from "../utils/error.js";

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
  ): Promise<FriendsRequestsData | null> {
    try {
      // friends
      const friendsData = await friends.findOneAndUpdate(
        { _id: userId },
        {
          $setOnInsert: {
            _id: userId,
            friends: [],
          } as UpdateFilter<Friends>,
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );
      if (friendsData.ok === 0) return null;
      // requests
      const requestsData = await requests.find({
        $or: [{ recipient: userId }, { expeditor: userId }],
      });
      const requestsArray = await requestsData.toArray();
      // final data
      return {
        friendsData: friendsData.value,
        requestsData: requestsArray,
      };
    } catch (e) {
      if (e instanceof Error)
        console.log("Could not get friends data", e.message);
      return null;
    }
  }

  async function requestAlreadyExist(
    userId: ObjectId,
    otherId: ObjectId
  ): Promise<boolean> {
    const users = [userId, otherId];
    try {
      const res = await requests.findOne({
        expeditor: { $in: users },
        recipient: { $in: users },
      });
      return res !== null;
    } catch (e) {
      return false;
    }
  }

  async function addFriendRequest(
    userId: ObjectId,
    username: string,
    otherId: ObjectId,
    othername: string
  ): Promise<FriendRequest | null> {
    const alreadyExist = await requestAlreadyExist(userId, otherId);
    if (alreadyExist) throw new AppError(400, "Request already exist");
    try {
      const request: FriendRequest = {
        expeditor: userId,
        expeditorName: username,
        recipient: otherId,
        recipientName: othername,
      };
      const res = await requests.insertOne(request);
      if (!res.acknowledged) return null;
      return request;
    } catch (e) {
      if (e instanceof Error)
        console.log("Could not get friends data", e.message);
      return null;
    }
  }

  async function removeFriendRequest(requestId: ObjectId): Promise<boolean> {
    try {
      const res = await requests.deleteOne({ _id: requestId });
      if (!res.acknowledged || res.deletedCount === 0) return false;
      return true;
    } catch (e) {
      if (e instanceof Error)
        console.log("Could not remove friend request", e.message);
      return false;
    }
  }

  async function acceptFriendRequest(
    userId: ObjectId,
    requestId: ObjectId
  ): Promise<boolean> {
    // search friend request
    let friendRequest: WithId<FriendRequest>;
    try {
      friendRequest = await requests.findOne({ _id: requestId });
      if (!friendRequest) throw new Error();
    } catch (e) {
      throw new AppError(500, "Could not find the friend request");
    }

    // user is not the one that can accept the friend request, not the recipient
    if (!friendRequest.recipient.equals(userId))
      throw new AppError(400, "Friend request recipient is not matching");

    // everything is valid, remove request and add to friends
    // TODO: maybe make a transaction so that if everything is
    // cancelled in case of error
    try {
      await requests.deleteOne({ _id: friendRequest._id });
      const recipient: Friend = {
        user_id: friendRequest.recipient,
        username: friendRequest.recipientName,
      };
      const expeditor: Friend = {
        user_id: friendRequest.expeditor,
        username: friendRequest.expeditorName,
      };
      const res = await friends.bulkWrite([
        {
          updateOne: {
            filter: { _id: friendRequest.expeditor },
            update: {
              $setOnInsert: {
                _id: friendRequest.expeditor,
              },
              $push: {
                friends: recipient,
              },
            },
            upsert: true,
          },
        },
        {
          updateOne: {
            filter: { _id: friendRequest.recipient },
            update: {
              $setOnInsert: {
                _id: friendRequest.recipient,
              },
              $push: {
                friends: expeditor,
              },
            },
            upsert: true,
          },
        },
      ]);
      if (res.hasWriteErrors()) throw new Error();
      return true;
    } catch (e) {
      if (e instanceof Error)
        console.error("friend request accept transaction", e.message);
      throw new AppError(
        500,
        "Could not finish the transaction to accept friend request"
      );
    }
  }

  async function removeFriend(
    userId: ObjectId,
    otherId: ObjectId
  ): Promise<boolean> {
    try {
      const res = await friends.bulkWrite([
        {
          updateOne: {
            filter: { _id: userId },
            update: {
              $pull: {
                friends: { user_id: otherId },
              },
            },
          },
        },
        {
          updateOne: {
            filter: { _id: otherId },
            update: {
              $pull: {
                friends: { user_id: userId },
              },
            },
          },
        },
      ]);
      if (res.hasWriteErrors() || res.modifiedCount !== 2) return false;
      return true;
    } catch (e) {
      if (e instanceof Error) console.error("remove friend error", e.message);
      return false;
    }
  }

  return {
    getFriendsAndRequests,
    addFriendRequest,
    removeFriendRequest,
    acceptFriendRequest,
    removeFriend,
  };
}
