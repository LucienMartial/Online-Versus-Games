import express, { Express, Request, Response } from "express";
import appRoot from "app-root-path";
import path from "path";

import { basic } from "./shared/main";

console.log(basic());

const distPath = path.join(appRoot.path, "build/dist");
const app: Express = express();
app.use(express.static(distPath));
const PORT = process.env.PORT || 8080;

app.get("/", (req: Request, res: Response) => {
  res.sendFile(distPath);
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});
