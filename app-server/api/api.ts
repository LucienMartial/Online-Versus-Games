import { Request, Response, Router } from "express";
import { Message } from "../../app-shared/types/api-types.js";
import { handleAppError } from "../utils/error.js";
import LoginRouter from "./login.js";
import RegisterRouter from "./register.js";

export default function (database: any): Router {
  const router = Router();
  router.use(LoginRouter(database));
  router.use(RegisterRouter(database));

  router.get("/", (req: Request, res: Response) => {
    console.log("request received for /api");
    const msg: Message = {
      content: "Hello World from API",
      date: new Date().toString(),
    };
    res.json(msg);
  });

  router.get("/game-info", (req: Request, res: Response) => {
    console.log("request received for game info");
  });

  router.use(handleAppError);
  return router;
}

// export default router;
