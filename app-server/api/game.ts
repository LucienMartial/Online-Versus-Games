import { Request, Response, Router } from "express";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.post("/game-create", async (req: Request, res: Response) => {});

  return router;
}
