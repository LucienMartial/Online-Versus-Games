import { ObjectId } from "mongodb";

/**
 * User
 */

interface User {
  name: string;
  password: string;
}

/**
 * Game
 */

interface Game {
  timestamp: Date;
  players: GamePlayer[];
}

interface GamePlayer {
  user_id: ObjectId;
  username: string;
  victory: boolean;
  deaths: number;
  straightShots: number;
  curveShots: number;
  shields: number;
  shieldCatches: number;
  dashes: number;
}

/**
 * Friend
 * id is the same as the user's one
 */

interface Friends {
  _id: ObjectId;
  friends: { user_id: ObjectId; username: string }[];
}

/**
 * Friend Request
 */

enum FriendRequestStatus {
  Sent = 0,
  Accepted = 1,
}

interface FriendRequest {
  recipient: ObjectId;
  recipientName: string;
  expeditor: ObjectId;
  expeditorName: string;
  status: FriendRequestStatus;
}

/**
 * Friends + request data
 */

interface FriendsRequestsData {
  friendsData: Friends;
  requestsData: FriendRequest[];
}

export { FriendRequestStatus };
export type {
  User,
  Game,
  GamePlayer,
  Friends,
  FriendRequest,
  FriendsRequestsData,
};
