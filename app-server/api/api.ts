import { Router } from "express";
import { handleAppError } from "../utils/error.js";
import LoginRouter from "./login.js";
import RegisterRouter from "./register.js";
import LogoutRemoveRouter from "./logout-remove.js";
import GameRouter from "./game.js";

export default function (database: any): Router {
  const router = Router();
  router.use(LoginRouter(database));
  router.use(RegisterRouter(database));
  router.use(LogoutRemoveRouter(database));
  router.use(GameRouter(database));
  router.use(handleAppError);
  return router;
}

// export default router;
