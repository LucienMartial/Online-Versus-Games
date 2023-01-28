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

interface FriendRequest {
  recipient: ObjectId;
  recipientName: string;
  expeditor: ObjectId;
  expeditorName: string;
}

/**
 * Friends + request data
 */

interface FriendsRequestsData {
  friendsData: Friends;
  requestsData: FriendRequest[];
}

export type {
  User,
  Game,
  GamePlayer,
  Friends,
  FriendRequest,
  FriendsRequestsData,
};
