import {NextFunction, Request, Response, Router} from "express";
import {AppError} from "../utils/error.js";
import {db} from "../../index.js";

const router = Router({mergeParams: true});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  console.log("login request");
  // already connected
  if (req.session.authenticated) {
    res.statusMessage = "Already logged in";
    return res.status(200).end();
  }
  if (!req.body.username || !req.body.password) {
    res.statusMessage = "Missing username or password";
    return res.status(400).end();
  }
  db.matchPassword(req.body.username, req.body.password).then((match) => {
    if (match) {
      req.session.authenticated = true;
      res.statusMessage = "Login successful";
      return res.status(200).end();
    }
    throw new AppError(400, "Invalid user or password");
  }).catch(next);
});

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

router.post("/register", (req: Request, res: Response) => {
  console.log("register request");
  if (!req.body.username || !req.body.password) {
    res.statusMessage = "Missing username or password";
    return res.status(400).end();
  }
  db.createUser(req.body.username, req.body.password).then(r => {
    if (r.acknowledged) {
      res.statusMessage = "User created";
      return res.status(200).end();
    } else {
      // register failed
      //throw new AppError(400, "Register failed"); //TODO : use this instead of the following
      res.statusMessage = "Register failed";
      return res.status(400).end();
    }
  });
});

export default router;
