import { Collection, Db, MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const saltRounds = 10;

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection;

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
  }

  private async searchUser(username: string) {
    try {
      const query = { name: username };
      return await this.users.findOne(query);
    } catch (e) {
      if (e instanceof Error) console.log("user search error", e.message);
    }
  }

  async removeUser(username: string): Promise<boolean> {
    try {
      const query = { name: username };
      const res = await this.users.deleteOne(query);
      return res && res.deletedCount === 1;
    } catch (e) {
      if (e instanceof Error) console.log("user deletion error", e.message);
      return false;
    }
  }

  async createUser(username: string, password: string) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const user = { name: username, password: hash };
      return await this.users.insertOne(user);
    } catch (e) {
      if (e instanceof Error) console.log("user creation error", e.message);
    }
  }

  async matchPassword(username: string, password: string): Promise<boolean> {
    const user = await this.searchUser(username);
    if (user && user.password) {
      const hash = user.password;
      return await bcrypt.compare(password, hash);
    }
    return false;
  }

  async close() {
    await this.client.close();
  }
}

export { Database };
