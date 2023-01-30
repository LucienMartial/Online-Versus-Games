import { ObjectId, WithId } from "mongodb";

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

interface Friend {
  user_id: ObjectId;
  username: string;
}

interface Friends {
  _id: ObjectId;
  friends: Friend[];
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
  requestsData: WithId<FriendRequest>[];
}

/**
 * User Profile
 */

interface Profile {}

/**
 * User Shop data
 */

interface SelectedItems {
  skinID: number;
  hatID: number;
  faceID: number;
}

interface UserShop {
  coins: number;
  items: number[];
  selectedItems: SelectedItems;
}

export type {
  User,
  Game,
  GamePlayer,
  Friend,
  Friends,
  FriendRequest,
  FriendsRequestsData,
  Profile,
  UserShop,
  SelectedItems,
};
