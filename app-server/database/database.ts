import { Collection, Db, ModifyResult, MongoClient, WithId } from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import ClientMethods from "./db-user.js";
import GameMethods from "./db-game.js";
import FriendMethods from "./db-friends.js";
import {
  FriendRequest,
  Friends,
  FriendsRequestsData,
  Game,
  User,
} from "../../app-shared/types/index.js";
import { ObjectId } from "mongodb";

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection<User>;
  private games: Collection<Game>;
  private friends: Collection<Friends>;
  private friendRequests: Collection<FriendRequest>;

  // users
  searchUser: (username: string) => Promise<WithId<User> | null>;
  removeUser: (username: string) => Promise<boolean>;
  createUser: (username: string, password: string) => Promise<ObjectId | null>;
  matchPassword: (password: string, user: User) => Promise<boolean>;

  // games
  createGame: (state: EndGameState) => Promise<void>;
  getGames: (id: ObjectId, skip: number, limit: number) => Promise<Game[]>;

  // friends
  getFriendsAndRequests: (
    userId: ObjectId
  ) => Promise<FriendsRequestsData | null>;
  addFriendRequest: (
    userId: ObjectId,
    username: string,
    otherId: ObjectId,
    othername: string
  ) => Promise<FriendRequest | null>;
  removeFriendRequest: (requestId: ObjectId) => Promise<boolean>;
  acceptFriendRequest: (requestId: ObjectId) => Promise<boolean>;
  removeFriend: (otherName: string) => Promise<boolean>;

  constructor() {
    if (process.env.MONGODB_URL === "") console.log("MONGODB URL is empty");
    else console.log("MONGODB URL is not empty");
    const url = process.env.MONGODB_URL;
    this.client = new MongoClient(url);
  }

  async connect() {
    await this.client.connect();
    this.database = this.client.db("online-versus-game");
    this.users = this.database.collection("Users");
    this.games = this.database.collection("games");
    this.friends = this.database.collection("friends");
    this.friendRequests = this.database.collection("friend-requests");

    // users
    const { searchUser, removeUser, createUser, matchPassword } = ClientMethods(
      this.users
    );
    this.searchUser = searchUser;
    this.removeUser = removeUser;
    this.createUser = createUser;
    this.matchPassword = matchPassword;

    // games
    const { createGame, getGames } = GameMethods(this.games);
    this.createGame = createGame;
    this.getGames = getGames;

    // friends
    const {
      getFriendsAndRequests,
      addFriendRequest,
      removeFriendRequest,
      acceptFriendRequest,
      removeFriend,
    } = FriendMethods(this.friends, this.friendRequests);
    this.getFriendsAndRequests = getFriendsAndRequests;
    this.addFriendRequest = addFriendRequest;
    this.removeFriendRequest = removeFriendRequest;
    this.acceptFriendRequest = acceptFriendRequest;
    this.removeFriend = removeFriend;
  }

  async close() {
    await this.client.close();
  }
}

export { Database };
