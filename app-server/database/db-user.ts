import bcrypt from "bcryptjs";
import { ObjectId, WithId } from "mongodb";
import { Collection } from "mongodb";
import { User } from "../../app-shared/types/db-types.js";

const saltRounds = 10;

export default function (users: Collection<User>) {
  async function searchUser(username: string): Promise<WithId<User> | null> {
    try {
      const query = { name: username };
      return await users.findOne(query);
    } catch (e) {
      if (e instanceof Error) console.log("user search error", e.message);
      return null;
    }
  }

  async function createUser(
    username: string,
    password: string
  ): Promise<ObjectId | null> {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(password, salt);
      const user = await users.insertOne({ name: username, password: hash });
      return user.insertedId;
    } catch (e) {
      if (e instanceof Error) console.log("user creation error", e.message);
      return null;
    }
  }

  async function matchPassword(password: string, user: User): Promise<boolean> {
    if (user && user.password) {
      const hash = user.password;
      return await bcrypt.compare(password, hash);
    }
    return false;
  }

  return { searchUser, createUser, matchPassword };
}
