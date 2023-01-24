import { Request, Response, Router } from "express";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

/**
 * Manage disconnection and remove of account
 */

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.get("/logout", async (req: Request, res: Response) => {
    // not connected
    if (!req.session.authenticated) throw new AppError(400, "Not connected");
    // logout
    req.session = null;
    return res.status(200).end();
  });

  return router;
}
