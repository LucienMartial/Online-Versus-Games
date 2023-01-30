import { ObjectId } from "mongodb";

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

interface ItemTarget {
  itemId: number;
}

export type { Error, Message, Login, UserTarget, ItemTarget, RequestTarget };
