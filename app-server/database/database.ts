import { Collection, Db, MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const saltRounds = 10;

class Database {
  private client: MongoClient;
  private database: Db;
  private users: Collection;

  constructor() {
    const url = process.env.MONGODB_URL;
    this.client = new MongoClient(url);
  }

  async connect() {
    try {
      await this.client.connect();
      this.database = this.client.db("online-versus-game");
      this.users = this.database.collection("Users");
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  private async searchUser(username: string) {
    try {
      const query = { name: username };
      const user = await this.users.findOne(query);
      console.log(user);
      return user;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  async createUser(username: string, password: string) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const user = { name: username, password: hash };
      return await this.users.insertOne(user);
    } catch (err: any) {
      // user already exists
      return { acknowledged: false };
    }
  }

  async matchPassword(username: string, password: string) {
    try {
      const user = await this.searchUser(username);
      if (user && user.password) {
        const hash = user.password;
        return await bcrypt.compare(password, hash);
      }
      return false;
    } catch (err: any) {
      console.log(err.stack);
    }
  }

  async close() {
    await this.client.close();
  }
}

export { Database };
