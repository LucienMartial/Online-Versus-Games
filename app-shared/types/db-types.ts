import { ObjectId } from "mongodb";

interface User {
  name: string;
  password: string;
}

interface Game {
  timestamp: Date;
  players: GamePlayer[];
}

interface GamePlayer {
  user_id: ObjectId;
  username: string;
  victory: boolean;
  deaths: number;
  straightShots: number;
  curveShots: number;
  shields: number;
  shieldCatches: number;
  dashes: number;
}

export type { User, Game, GamePlayer };
