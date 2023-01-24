import { beforeEach, describe, expect, it, vi, withCallback } from "vitest";
import request from "supertest";
import { initApp, withCookie } from "../utils";

const matchPassword = vi.fn();
const app = initApp({ matchPassword });

describe("GET /logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("already connected", async () => {
    const req = withCookie(request(app).get("/api/logout"), {
      authenticated: true,
    });
    const res = await req;
    expect(res.status).toEqual(200);
    expect(res.headers["set-cookie"]).not.toEqual(req.get("Cookie"));
  });

  it("not connected", async () => {
    const res = await request(app).get("/api/logout");
    expect(res.status).toEqual(400);
  });
});
