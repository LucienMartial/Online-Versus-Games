import { ObjectId } from "mongodb";
import { FriendRequest, Friends } from "./db-types.js";

interface Message {
  content: string;
  date: Date;
}

interface Login {
  id: ObjectId;
}

interface UserTarget {
  username: string;
}

interface RequestTarget {
  id: ObjectId;
}

interface Error {
  message: string;
}

interface ApiShopData {
  coins: number;
  items: number[];
}

export type { Error, Message, Login, UserTarget, ApiShopData, RequestTarget };
