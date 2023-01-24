import bcrypt from "bcryptjs";
import { Collection } from "mongodb";

const saltRounds = 10;

export default function (users: Collection) {
  async function searchUser(username: string) {
    try {
      const query = { name: username };
      return await users.findOne(query);
    } catch (e) {
      if (e instanceof Error) console.log("user search error", e.message);
    }
  }

  async function removeUser(username: string): Promise<boolean> {
    try {
      const query = { name: username };
      const res = await users.deleteOne(query);
      return res && res.deletedCount === 1;
    } catch (e) {
      if (e instanceof Error) console.log("user deletion error", e.message);
      return false;
    }
  }

  async function createUser(username: string, password: string) {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const user = { name: username, password: hash };
      return await users.insertOne(user);
    } catch (e) {
      if (e instanceof Error) console.log("user creation error", e.message);
    }
  }

  async function matchPassword(
    username: string,
    password: string
  ): Promise<boolean> {
    const user = await searchUser(username);
    if (user && user.password) {
      const hash = user.password;
      return await bcrypt.compare(password, hash);
    }
    return false;
  }

  return { removeUser, createUser, matchPassword };
}
