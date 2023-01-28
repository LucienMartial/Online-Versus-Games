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

interface Error {
  message: string;
}

export type { Error, Message, Login, UserTarget };
