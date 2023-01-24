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

  private async removeUser(username: string) {
    const query = { name: username };
  }

  private async searchUser(username: string) {
    const query = { name: username };
    const user = await this.users.findOne(query);
    return user;
  }

  async createUser(username: string, password: string) {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    const user = { name: username, password: hash };
    return await this.users.insertOne(user);
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
