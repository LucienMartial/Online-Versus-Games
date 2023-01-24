import { Request, Response, Router } from "express";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.post("/register", async (req: Request, res: Response) => {
    // non valid request
    if (!req.body.username || !req.body.password) {
      throw new AppError(400, "Missing username or password");
    }
    // try to create a user
    const response = await db.createUser(req.body.username, req.body.password);
    // register succeed
    if (response.acknowledged) {
      res.statusMessage = "User created";
      return res.status(200).end();
    }
    // register failed
    throw new AppError(400, "Registration failed");
  });

  return router;
}
