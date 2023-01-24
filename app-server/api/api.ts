import { Request, Response, Router } from "express";
import { Message } from "../../app-shared/types/api-types.js";
import { handleAppError } from "../utils/error.js";
import LoginRouter from "./login.js";
import RegisterRouter from "./register.js";
import LogoutRemoveRouter from "./logout-remove.js";

export default function (database: any): Router {
  const router = Router();
  router.use(LoginRouter(database));
  router.use(RegisterRouter(database));
  router.use(LogoutRemoveRouter(database));
  router.use(handleAppError);
  return router;
}

// export default router;
