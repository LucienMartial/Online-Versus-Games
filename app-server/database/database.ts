import { Collection, Db, MongoClient, WithId } from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import ClientMethods from "./db-user.js";
import GameMethods from "./db-game.js";
import { Game, User } from "../../app-shared/types/index.js";
import { ObjectId } from "mongodb";

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection<User>;
  private games: Collection<Game>;

  // users
  searchUser: (username: string) => Promise<WithId<User> | null>;
  removeUser: (username: string) => Promise<boolean>;
  createUser: (username: string, password: string) => Promise<ObjectId | null>;
  matchPassword: (password: string, user: User) => Promise<boolean>;

  // games
  createGame: (state: EndGameState) => Promise<void>;
  getGames: (id: ObjectId, skip: number, limit: number) => Promise<Game[]>;

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
  }

  async close() {
    await this.client.close();
  }
}

export { Database };
