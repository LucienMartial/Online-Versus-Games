import { Request, Response, Router } from "express";
import { DEFAULT_DISCWAR_STATS } from "../../app-shared/disc-war/types.js";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.get("/history/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    const user = await db.searchUser(username);
    if (!user) throw new AppError(400, "User does not exist");
    const games = await db.discWar.getGames(user._id, 0, 30);
    res.status(200).json(games);
  });

  router.get("/profile/:username", async (req: Request, res: Response) => {
    const username = req.params.username;
    const user = await db.searchUser(username);
    if (!user) throw new AppError(400, "User does not exist");
    const profile = await db.discWar.getProfile(
      user._id,
      DEFAULT_DISCWAR_STATS,
    );
    res.status(200).json(profile);
  });

  return router;
}
