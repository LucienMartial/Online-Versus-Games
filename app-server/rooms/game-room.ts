import { Dispatcher } from "@colyseus/command";
import { Client, matchMaker, Room } from "colyseus";
import { ObjectId, WithId } from "mongodb";
import { GameEngine } from "../../app-shared/game/index.js";
import { Profile, UserShop } from "../../app-shared/types/db-types.js";
import { Request } from "express";

interface GameParams<G extends GameEngine> {
  dbCreateGame: (state: any) => Promise<void>;
  dbGetProfile: (userId: ObjectId) => Promise<Profile | null>;
  dbUpdateProfile: (
    userId: ObjectId,
    profile: Profile,
    userState: any,
  ) => Promise<boolean>;
  dbGetUserShop: (userID: ObjectId) => Promise<WithId<UserShop> | null>;
  dbAddCoins: (userId: ObjectId, coins: number) => Promise<boolean>;
  engine: {
    new (
      isServer: boolean,
    ): G;
  };
}

// Generic game room, take state and game engine as parameteris
// client data is populated with username and id by default
class GameRoom<T, G extends GameEngine> extends Room<T> {
  dbGetUserShop!: (userID: ObjectId) => Promise<WithId<UserShop> | null>;
  dbCreateGame!: (state: any) => Promise<void>;
  dbGetProfile!: (userId: ObjectId) => Promise<Profile | null>;
  dbUpdateProfile!: (
    userId: ObjectId,
    profile: Profile,
    userState: any,
  ) => Promise<boolean>;
  dbAddCoins!: (userId: ObjectId, coins: number) => Promise<boolean>;
  gameEngine!: G;

  dispatcher = new Dispatcher(this);
  gameEnded = false;
  nbClient = 0;
  clientsMap: Map<string, string> = new Map();

  onCreate({
    dbGetUserShop,
    dbCreateGame,
    dbGetProfile,
    dbUpdateProfile,
    dbAddCoins,
    engine,
  }: GameParams<G>) {
    this.dbGetUserShop = dbGetUserShop;
    this.dbCreateGame = dbCreateGame;
    this.dbGetProfile = dbGetProfile;
    this.dbUpdateProfile = dbUpdateProfile;
    this.dbAddCoins = dbAddCoins;

    this.setSimulationInterval((dt: number) => this.update(dt), 1000 / 60);
    this.setPatchRate(20);
    this.gameEngine = new engine(true);
    this.gameEngine.onEndGame = () => {
      this.onEndGame();
    };
  }

  // verify token, etc..
  async onAuth(client: Client, _options: unknown, request: Request) {
    // check if authentified
    if (!request.session || !request.session.authenticated) return false;
    // check if already in a room
    const id = request.session.id;
    const username = request.session.username;
    const alreadyExist = [...this.clientsMap.values()].includes(username);
    if (!username || !id || alreadyExist) {
      return false;
    }

    // add username
    this.clientsMap.set(client.id, username);
    console.log("client authenticated", username, id);

    // client data
    client.userData = {
      username: username,
      id: id,
    };

    return true;
  }

  // need to be implemented
  async onEndGame() {}

  // used in onEndGame implementation to pass data to parent (ugly)
  async endGame(
    endState: { players: Map<string, { victory: boolean }> },
    coins_win: number,
    coins_lose: number,
  ) {
    this.gameEnded = true;
    const chatEndGameRoom = await matchMaker.createRoom("chat-room", {});
    await this.dbCreateGame(endState);

    // update profile of clients
    console.log(this.clients);
    for (const client of this.clients) {
      try {
        const objectId = new ObjectId(client.userData.id);
        const profile = await this.dbGetProfile(objectId);
        if (!profile) throw new Error("could not get profile");
        console.log(endState.players);
        const playerState = endState.players.get(client.id);
        if (!playerState) continue;
        await this.dbUpdateProfile(objectId, profile, playerState);
        await this.dbAddCoins(
          objectId,
          playerState.victory ? coins_win : coins_lose,
        );
      } catch (e) {
        if (e instanceof Error) {
          console.error("could not update user profile / shop", e.message);
        }
      }
    }

    // send event to clients
    for (const client of this.clients) {
      const reservation = await matchMaker.reserveSeatFor(
        chatEndGameRoom,
        {},
      );
      // important/mandatory !
      client.send("end-game-chat-reservation", reservation);
      client.send("end-game", endState);
    }
  }

  onDispose(): void | Promise<any> {
    this.dispatcher.stop();
  }

  update(_dt: number): void {}
}

export { GameRoom };
export type { GameParams };
