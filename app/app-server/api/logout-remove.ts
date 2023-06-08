import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";
import { removeSesion } from "../utils/session.js";

/**
 * Manage disconnection and remove of account
 */

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.post("/logout", async (req: Request, res: Response) => {
    // not connected
    if (!req.session.authenticated) throw new AppError(400, "Not connected");
    // logout
    removeSesion(req);
    return res.status(200).end();
  });

  router.post("/remove-account", async (req: Request, res: Response) => {
    // not connected
    if (
      !req.session.authenticated ||
      !req.session.username ||
      !req.session.id
    ) {
      throw new AppError(400, "Not connected");
    }
    // remove user
    const id = new ObjectId(req.session.id);
    const result = await db.removeUser(id);
    if (!result) {
      throw new AppError(400, "Could not remove user: " + req.session.username);
    }
    // succesfuly removed
    removeSesion(req);
    return res.status(200).end();
  });

  return router;
}
