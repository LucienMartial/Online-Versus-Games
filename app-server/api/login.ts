import { NextFunction, Request, Response, Router } from "express";
import { Database } from "../database/database.js";
import { AppError } from "../utils/error.js";

export default function (db: Database): Router {
  const router = Router({ mergeParams: true });

  router.post(
    "/login",
    async (req: Request, res: Response, next: NextFunction) => {
      console.log("login request");

      // already connected
      if (req.session.authenticated) {
        res.statusMessage = "Already logged in";
        return res.status(200).end();
      }

      // missing information
      if (!req.body.username || !req.body.password) {
        throw new AppError(400, "Missing username or password");
      }

      // password matching with registered one
      try {
        const match = await db.matchPassword(
          req.body.username,
          req.body.password
        );
        // not matching
        if (!match) throw new AppError(400, "Invalid user or password");
        // matching
        req.session.authenticated = true;
        req.session.username = req.body.username;
        res.statusMessage = "Login successful";
        return res.status(200).end();
      } catch (e) {
        next();
      }
    }
  );

  router.get("/cookie-checker", (req: Request, res: Response) => {
    console.log("request received for /api/cookie-checker : " + req.session);

    // already authentified
    if (req.session.authenticated) {
      return res.status(200).end();
    }

    // need login
    throw new AppError(400, "Need to login");

    // if (req.session.nowInMinutes) {
    //   const cookieChecker: Checker = {
    //     status: 200,
    //     message: "Cookie is set"
    //   };
    //   res.json(cookieChecker);
    // } else {
    //   const cookieChecker: Checker = {
    //     status: 400,
    //     message: "Cookie is not set"
    //   };
    //   res.json(cookieChecker);
    // }
  });

  return router;
}
