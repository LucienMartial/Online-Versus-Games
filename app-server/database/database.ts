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
  acceptFriendRequest: (
    userId: ObjectId,
    requestId: ObjectId
  ) => Promise<boolean>;
  removeFriend: (userId: ObjectId, otherId: ObjectId) => Promise<boolean>;

  constructor() {
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
    const { searchUser, createUser, matchPassword } = ClientMethods(this.users);
    this.searchUser = searchUser;
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

  /**
   * Remove user, should be a transaction because there is mutliple collection involved
   */
  async removeUser(userId: ObjectId): Promise<boolean> {
    try {
      await this.users.deleteOne({ _id: userId });
      await this.friends.deleteOne({ _id: userId });
      await this.friends.updateMany(
        {
          friends: { $elemMatch: { user_id: userId } },
        },
        { $pull: { friends: { user_id: userId } } }
      );
      await this.friendRequests.deleteMany({
        expeditor: userId,
        recipient: userId,
      });
      return true;
    } catch (e) {
      if (e instanceof Error) console.error("user deletion error", e.message);
      // temp, need transaction
      return true;
    }
  }

  async close() {
    await this.client.close();
  }
}

export { Database };
