import { NextFunction, Request, Response, Router } from "express";
import { AppError } from "../utils/error.js";

const router = Router({ mergeParams: true });

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  console.log("login request");
  // already connected
  if (req.session.authenticated) {
    res.statusMessage = "Already logged in";
    res.status(200).end();
  }

  // check if login data is valid
  if (req.body.username === "john") {
    req.session.authenticated = true;
    res.statusMessage = "Logged in sucessfully";
    res.status(200).end();
  }

  // login failed
  throw new AppError(400, "Login failed");
});

router.get("/cookie-checker", (req: Request, res: Response) => {
  console.log("request received for /api/cookie-checker : " + req.session);

  // already authentified
  if (req.session.authenticated) {
    res.status(200).end();
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

export default router;
