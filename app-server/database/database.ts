import { Collection, Db, MongoClient, WithId } from "mongodb";
import ClientMethods from "./db-user.js";
import FriendMethods from "./db-friends.js";
import UserShopMethods from "./db-user-shop.js";
import {
  FriendRequest,
  Friends,
  FriendsRequestsData,
  SelectedItems,
  User,
  UserShop,
} from "../../app-shared/types/index.js";
import { ObjectId } from "mongodb";
import { DiscWarStats } from "../../app-shared/disc-war/types.js";
import { DatabaseGame } from "./db-games.js";

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection<User>;
  private friends: Collection<Friends>;
  private friendRequests: Collection<FriendRequest>;
  private userShops: Collection<UserShop>;
  private customGames: DatabaseGame<any>[];

  /*
    Define here you game's history and profiles collection
  */

  // games
  discWar: DatabaseGame<DiscWarStats>;

  async add_games() {
    this.discWar = new DatabaseGame(this.database, "games", "profiles");
    this.customGames.push(this.discWar);
  }

  /*
    End of user definition
  */

  // users
  searchUser: (username: string) => Promise<WithId<User> | null>;
  createUser: (username: string, password: string) => Promise<ObjectId | null>;
  matchPassword: (password: string, user: User) => Promise<boolean>;

  // friends
  getFriendsAndRequests: (
    userId: ObjectId,
  ) => Promise<FriendsRequestsData | null>;
  addFriendRequest: (
    userId: ObjectId,
    username: string,
    otherId: ObjectId,
    othername: string,
  ) => Promise<FriendRequest | null>;
  removeFriendRequest: (requestId: ObjectId) => Promise<boolean>;
  acceptFriendRequest: (
    userId: ObjectId,
    requestId: ObjectId,
  ) => Promise<boolean>;
  removeFriend: (userId: ObjectId, otherId: ObjectId) => Promise<boolean>;

  // shop
  getUserShop: (userId: ObjectId) => Promise<WithId<UserShop> | null>;
  addCoins: (userId: ObjectId, coins: number) => Promise<boolean>;
  selectUserShopItem: (
    userId: ObjectId,
    selectedItems: SelectedItems,
  ) => Promise<boolean>;
  buyUserShopItem: (
    userId: ObjectId,
    itemId: number,
    remainingCoins: number,
  ) => Promise<boolean>;

  constructor() {
    const url = process.env.MONGODB_URL;
    this.client = new MongoClient(url);
  }

  async connect() {
    await this.client.connect();
    this.database = this.client.db("online-versus-game");
    this.users = this.database.collection("Users");
    this.friends = this.database.collection("friends");
    this.friendRequests = this.database.collection("friend-requests");
    this.userShops = this.database.collection("user-shops");

    // add user games
    this.customGames = [];
    this.add_games();

    // users
    const { searchUser, createUser, matchPassword } = ClientMethods(this.users);
    this.searchUser = searchUser;
    this.createUser = createUser;
    this.matchPassword = matchPassword;

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

    // user shop
    const { getUserShop, buyUserShopItem, selectUserShopItem, addCoins } =
      UserShopMethods(this.userShops);
    this.getUserShop = getUserShop;
    this.buyUserShopItem = buyUserShopItem;
    this.selectUserShopItem = selectUserShopItem;
    this.addCoins = addCoins;
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
        { $pull: { friends: { user_id: userId } } },
      );
      await this.friendRequests.deleteMany({
        expeditor: userId,
        recipient: userId,
      });
      await this.userShops.deleteOne({ _id: userId });

      // remove from all games
      for (const game of this.customGames) {
        await game.profiles.deleteOne({ _id: userId });
      }

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
