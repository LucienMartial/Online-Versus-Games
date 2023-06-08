import { Request } from "express";
import { ObjectId } from "mongodb";

function saveSession(req: Request, id: ObjectId) {
  req.session.authenticated = true;
  req.session.id = id;
  req.session.username = req.body.username;
}

function removeSesion(req: Request) {
  req.session = null;
}

export { saveSession, removeSesion };
