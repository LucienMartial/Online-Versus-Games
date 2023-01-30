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

interface ApiShopData {
  coins: number;
  items: number[];
  selectedItems: ApiSelectedItems;
}

interface ApiSelectedItems {
  skinID: number;
  hatID: number;
  faceID: number;
}

export type {
  Error,
  Message,
  Login,
  UserTarget,
  ApiShopData,
  RequestTarget,
  ApiSelectedItems,
};
