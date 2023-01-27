interface User {
  name: string;
  password: string;
}

interface Game {
  timestamp: Date;
  players: GamePlayer[];
}

interface GamePlayer {
  username: string;
  deathCount: number;
  victory: boolean;
}

export type { User, Game, GamePlayer };
