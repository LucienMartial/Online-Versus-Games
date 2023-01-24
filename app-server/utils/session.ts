import { Request } from "express";

function saveSession(req: Request) {
  req.session.authenticated = true;
  req.session.username = req.body.username;
}

function removeSesion(req: Request) {
  req.session = null;
}

export { saveSession, removeSesion };
