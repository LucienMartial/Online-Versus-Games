import request from "supertest";
import KeyGrip from "keygrip";
import { createApp } from "../app-server/app";

const sessionKeys = ["a", "b"];
const keyGrip = KeyGrip(sessionKeys, "SHA384", "base64");

function initApp(database: {}) {
  const { app } = createApp(sessionKeys, "../", database);
  return app;
}

function withCookie(request: request.Test, cookieData: {}): request.Test {
  const cookie = Buffer.from(JSON.stringify(cookieData)).toString("base64");
  const hash = keyGrip.sign("session=" + cookie);
  return request.set("Cookie", [
    "session=" + cookie + "; " + "session.sig=" + hash + ";",
  ]);
}

export { withCookie, initApp };
