import { Schema, SetSchema, type } from "@colyseus/schema";

class SocialState extends Schema {
  @type({ array: "string" }) users: string[] = [];

  constructor(users: string[]) {
    super();
    this.users = users;
  }
}

export { SocialState };
