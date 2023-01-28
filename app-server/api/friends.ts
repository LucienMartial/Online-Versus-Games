import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import { UserTarget } from "../../app-shared/types/api-types.js";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

/**
 *  check if client is valid and connected
 * */
function checkClientStatus(req: Request): { id: ObjectId; username: string } {
  const id = new ObjectId(req.session.id);
  const username = req.session.username;
  const notConnected = !req.session.authenticated || !id || !username;
  if (notConnected) throw new AppError(400, "Not connected");
  return { id, username };
}

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.get("/friends", async (req: Request, res: Response) => {
    const { id } = checkClientStatus(req);
    // fetch friends data
    const friendsRequestsData = await db.getFriendsAndRequests(id);
    if (!friendsRequestsData)
      throw new AppError(500, "Could not fetch friendsRequestsData data");
    // success
    res.status(200).json(friendsRequestsData);
  });

  /**
   * Request with friends as target
   */

  async function getTarget(
    req
  ): Promise<{ otherId: ObjectId; otherName: string }> {
    const data: UserTarget = req.body;
    if (!data.username)
      throw new AppError(400, "No user to remove was provided");
    const user = await db.searchUser(data.username);
    if (!user) throw new AppError(404, "Specified user does not exist");
    return { otherId: user._id, otherName: data.username };
  }

  router.post("/friends/remove", async (req: Request, res: Response) => {
    const id = checkClientStatus(req);
    const otherId = await getTarget(req);
  });

  router.post("/friends/request-add", async (req: Request, res: Response) => {
    const { id, username } = checkClientStatus(req);
    const { otherId, otherName } = await getTarget(req);
    const requestId = await db.addFriendRequest(
      id,
      username,
      otherId,
      otherName
    );
    if (!requestId) throw new AppError(500, "Could not add the friend request");
    res.status(200).json(requestId);
    res.status(200).end();
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
