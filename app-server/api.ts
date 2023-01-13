import { Router } from "express";
import { Message, Login, Checker } from "../app-shared/types/api.js";

const router = Router();

router.get("/api", (req, res) => {
  console.log("request received for /api");
  const msg: Message = {
    content: "Hello World from API",
    date: new Date().toString(),
  };
  res.json(msg);
});

router.post("/api/login", (req, res) => {
  const loginPayload: Login = req.body;

  if (req.session.authenticated) {
    const loginChecker: Checker = {
      status: 200,
      message: "Already logged in"
    };
    res.json(loginChecker);
  } else {
    if (req.body.username === "john") {
      req.session.authenticated = true;
      const loginChecker: Checker = {
        status: 200,
        message: "Login successful"
      };
      res.json(loginChecker);
    } else {
      const loginChecker: Checker = {
        status: 400,
        message: "Login failed"
      };
      res.json(loginChecker);
    }
  }

  res.json(loginPayload);
});

router.get("/api/cookie-checker", (req, res) => {
  console.log("request received for /api/cookie-checker : " + JSON.stringify(req.session));
  
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

  req.session.views = (req.session.views || 0) + 1;

  // Write response
  res.end(req.session.views + ' views');
});

export default router;
  