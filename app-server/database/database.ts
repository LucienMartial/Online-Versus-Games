import {
  Collection,
  Db,
  Document,
  InsertOneResult,
  MongoClient,
  WithId,
} from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import ClientMethods from "./db-user.js";
import GameMethods, { Game } from "./db-game.js";

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection;
  private games: Collection<Game>;

  // users
  searchUser: (username: string) => Promise<WithId<Document> | undefined>;
  removeUser: (username: string) => Promise<boolean>;
  createUser: (
    username: string,
    password: string
  ) => Promise<InsertOneResult<Document>>;
  matchPassword: (username: string, password: string) => Promise<boolean>;

  // games
  createGame: (state: EndGameState) => Promise<void>;
  getGames: (username: string, skip: number, limit: number) => Promise<Game[]>;

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
