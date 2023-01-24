import { Collection, Db, InsertOneResult, MongoClient } from "mongodb";
import { EndGameState } from "../../app-shared/state/end-game-state.js";
import ClientMethods from "./db-user.js";
import GameMethods, { Game } from "./db-game.js";

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection;
  private games: Collection<Game>;

  // users
  removeUser: (username: string) => Promise<boolean>;
  createUser: (
    username: string,
    password: string
  ) => Promise<InsertOneResult<Document>>;
  matchPassword: (username: string, password: string) => Promise<boolean>;

  // games
  createGame: (state: EndGameState) => Promise<void>;

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
    const { removeUser, createUser, matchPassword } = ClientMethods(this.users);
    this.removeUser = removeUser;
    this.createUser = createUser;
    this.matchPassword = matchPassword;

    // games
    const { createGame } = GameMethods(this.games);
    this.createGame = createGame;
  }

  async close() {
    await this.client.close();
  }
}

export { Database };
