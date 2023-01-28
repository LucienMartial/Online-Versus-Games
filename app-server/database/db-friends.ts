import { Collection, ObjectId, UpdateFilter } from "mongodb";
import {
  FriendRequest,
  FriendRequestStatus,
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
        requestsData: requestsArray as FriendRequest[],
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
        status: FriendRequestStatus.Sent,
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
    return false;
  }

  async function acceptFriendRequest(requestId: ObjectId): Promise<boolean> {
    return false;
  }

  async function removeFriend(otherName: string): Promise<boolean> {
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
