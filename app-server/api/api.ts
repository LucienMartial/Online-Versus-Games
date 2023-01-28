import { Router } from "express";
import { handleAppError } from "../utils/error.js";
import LoginRouter from "./login.js";
import RegisterRouter from "./register.js";
import LogoutRemoveRouter from "./logout-remove.js";
import ProfileRouter from "./profile.js";
import FriendsRouter from "./friends.js";
import ShopRouter from "./shop.js";

export default function (database: any): Router {
  const router = Router();
  router.use(LoginRouter(database));
  router.use(RegisterRouter(database));
  router.use(LogoutRemoveRouter(database));
  router.use(ProfileRouter(database));
  router.use(FriendsRouter(database));
  router.use(ShopRouter(database));
  router.use(handleAppError);
  return router;
}

// export default router;
