import { Request, Response, Router } from "express";
import { Login } from "../../app-shared/types/api-types.js";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";
import { saveSession } from "../utils/session.js";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.post("/login", async (req: Request, res: Response) => {
    // already connected
    if (req.session.authenticated) {
      res.statusMessage = "Already logged in";
      return res.status(200).end();
    }
    // missing information
    if (!req.body.username || !req.body.password) {
      throw new AppError(400, "Missing username or password");
    }
    // search user
    const user = await db.searchUser(req.body.username);
    if (!user) throw new AppError(400, "User does not exist");
    // does password match with registered one?
    const match = await db.matchPassword(req.body.password, user);
    // not matching
    if (!match) throw new AppError(400, "Invalid password");
    // matching
    saveSession(req, user._id);
    res.statusMessage = "Login successful";
    const data: Login = { id: user._id };
    return res.status(200).json(data);
  });

  router.get("/cookie-checker", (req: Request, res: Response) => {
    // already authentified
    if (req.session.authenticated) {
      return res.status(200).end();
    }
    // need login
    throw new AppError(400, "Need to login");
  });

  return router;
}
