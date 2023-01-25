interface Game {
  timestamp: Date;
  players: GamePlayer[];
}

interface GamePlayer {
  username: string;
  deathCount: number;
  victory: boolean;
}

export { Game, GamePlayer };