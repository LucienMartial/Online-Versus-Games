import { ObjectId } from "mongodb";

interface Message {
  content: string;
  date: Date;
}

interface Login {
  id: ObjectId;
}

interface Friend {
  username: string;
}

interface Error {
  message: string;
}

export type { Error, Message, Login, Friend };
