import { Request, Response, Router } from "express";
import { Login } from "../../app-shared/types/api-types.js";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";
import { saveSession } from "../utils/session.js";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.post("/register", async (req: Request, res: Response) => {
    // non valid request
    if (!req.body.username || !req.body.password) {
      throw new AppError(400, "Missing username or password");
    }
    // try to create a user
    const userId = await db.createUser(req.body.username, req.body.password);
    // register succeed
    if (userId) {
      saveSession(req, userId);
      res.statusMessage = "User created";
      const data: Login = { id: userId };
      return res.status(200).json(data);
    }
    // register failed
    throw new AppError(400, "Registration failed");
  });

  return router;
}
