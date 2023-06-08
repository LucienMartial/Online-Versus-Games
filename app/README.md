# Online Versus Games

Bachelor's degree project.

## Contributors

- MARTIAL Lucien
- COEFFIC-QABALI Riwan
- HIRTZ Flavien

## Dev

First install all the packages in the server and client.

```
npm run setup
```

Then, start the server and client instance in parallel.

```bash
npm run dev # in root
npm run dev # in client
```

To run the server tests.

```
npm run test
```

## Custom Game

### Database

Firstly, a game room must be created.

```ts
class CustomGame extends GameRoom<CustomGameState, CustomGameEngine, CustomGameStats> {
  onCreate(params: GameParams<CustomGameEngine, DiscWarStats>) {
    super.onCreate(params);
    ..
  }

  async onEndGame() { .. }
  onJoin(client: Client) { .. }
  onLeave(client: Client, constended: boolean) { .. }
  update(dt: number) { .. }
}
```

Then, we initialize a database object for user game history and profile.

```ts
// in user section of  database.ts
class Database {
  ..
  customGame: DatabaseGame<CustomGameStats>;
  async add_games() {
    this.customGame = new DatabaseGame(this.database, "games-collection-name", 
      "profiles-collection-name");
    this.customGames.push(this.customGame);
  }
  ..
}
```

Finally, we register the room.

```ts
// in index.ts
gameServer.define("custom-game", CustomGame, {
  dbCreateGame: db.customGame.createGame.bind(db.customGame),
  dbGetProfile: db.customGame.getProfile.bind(db.customGame),
  dbUpdateProfile: db.customGame.updateProfile.bind(db.customGame),
  dbGetUserShop: db.getUserShop.bind(db),
  dbAddCoins: db.addCoins.bind(db),
  engine: CustomGameEngine,
});
```
