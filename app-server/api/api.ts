import { Request, Response, Router } from "express";
import { Message } from "../../app-shared/types/api-types.js";
import { handleAppError } from "../utils/error.js";
import LoginRouter from "./login.js";

const router = Router();
router.use(LoginRouter);

router.get("/", (req: Request, res: Response) => {
  console.log("request received for /api");
  const msg: Message = {
    content: "Hello World from API",
    date: new Date().toString(),
  };
  res.json(msg);
});

router.use(handleAppError);

export default router;
