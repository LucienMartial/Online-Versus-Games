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

// stats are generic
interface Game<T> {
  timestamp: Date;
  players: GamePlayer<T>[];
}

interface GamePlayer<T> {
  user_id: ObjectId;
  username: string;
  victory: boolean;
  stats: T;
}

/**
 * User Profile
 */

// stats are generic
interface Profile<T> {
  games: number;
  wins: number;
  stats: T;
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
  Friend,
  FriendRequest,
  Friends,
  FriendsRequestsData,
  Game,
  GamePlayer,
  Profile,
  SelectedItems,
  User,
  UserShop,
};
