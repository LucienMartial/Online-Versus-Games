import { Request, Response, Router } from "express";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

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
    // does password match with registered one?
    const match = await db.matchPassword(req.body.username, req.body.password);
    // not matching
    if (!match) throw new AppError(400, "Invalid user or password");
    // matching
    req.session.authenticated = true;
    req.session.username = req.body.username;
    res.statusMessage = "Login successful";
    return res.status(200).end();
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
