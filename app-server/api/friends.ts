import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { Friend } from "../../app-shared/types/api-types.js";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

/**
 *  check if client is valid and connected
 * */
function checkClientStatus(req: Request): ObjectId {
  const id = req.session.id;
  const notConnected = !req.session.authenticated || !id;
  if (notConnected) throw new AppError(400, "Not connected");
  return id;
}

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.get("/friends", async (req: Request, res: Response) => {
    const id = checkClientStatus(req);
    // fetch friends data
    const friends = await db.getFriendsAndRequests(id);
    if (!friends || friends.ok === 0)
      throw new AppError(500, "Could not fetch friends data");
    // success
    res.status(200).json(friends.value);
  });

  /**
   * Request with friends as target
   */

  function checkTarget(req): string {
    const data: Friend = req.body;
    if (!data.username)
      throw new AppError(400, "No user to remove was provided");
    return data.username;
  }

  router.post("/friends/remove", async (req: Request, res: Response) => {
    const id = checkClientStatus(req);
    const friendName = checkTarget(req);
  });

  router.post("/friends/request-add", async (req: Request, res: Response) => {
    const id = checkClientStatus(req);
    const friendName = checkTarget(req);
  });

  router.post(
    "/friends/request-accept",
    async (req: Request, res: Response) => {
      const id = checkClientStatus(req);
    }
  );

  router.post(
    "/friends/request-remove",
    async (req: Request, res: Response) => {
      const id = checkClientStatus(req);
    }
  );

  return router;
}
