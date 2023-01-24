import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import apiRouter from "./api/api.js";
import KeyGrip from "keygrip";

// Create an express app given a database
export function createApp(
  cookieKeys: string[],
  __dirname: string,
  database: any
): {
  app: express.Express;
  session: express.RequestHandler;
  keyGrip: KeyGrip;
} {
  // cookie session
  const keyGrip = KeyGrip(cookieKeys, "SHA384", "base64");
  const session = cookieSession({
    name: "session",
    keys: keyGrip,
    maxAge: 10 * 60 * 1000, // 10 minutes
  });

  const app = express();
  app.use(session);

  app.use(express.json());
  app.use(express.static("dist"));
  app.use("/api", apiRouter(database));

  app.get("/*", (req, res) => {
    res.sendFile(__dirname + "/index.html");
  });

  return { app, session, keyGrip };
}
