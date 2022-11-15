import express, { Express, Request, Response } from "express";
import appRoot from "app-root-path";
import path from "path";

const distPath = path.join(appRoot.path, "build/dist");
const app: Express = express();
app.use(express.static(distPath));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(distPath);
});

// for testing purposes, send message to client
app.get("/test", (req: Request, res: Response) => {
  res.send("Test route, hello from server");
});

export default app;
