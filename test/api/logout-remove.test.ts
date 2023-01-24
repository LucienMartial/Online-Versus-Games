import { beforeEach, describe, expect, it, vi, withCallback } from "vitest";
import request from "supertest";
import { initApp, withCookie } from "../utils";

const matchPassword = vi.fn();
const removeUser = vi.fn();
const app = initApp({ matchPassword, removeUser });

describe("GET /logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("already connected", async () => {
    const req = withCookie(request(app).post("/api/logout"), {
      authenticated: true,
    });
    const res = await req;
    expect(res.status).toEqual(200);
    expect(res.headers["set-cookie"]).not.toEqual(req.get("Cookie"));
  });

  it("not connected", async () => {
    const res = await request(app).post("/api/logout");
    expect(res.status).toEqual(400);
  });
});

describe("POST /remove-account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("not connected, username not valid", async () => {
    let res = await request(app).post("/api/remove-account");
    expect(res.status).toEqual(400);
    res = await withCookie(request(app).post("/api/remove-account"), {
      authenticated: true,
    });
    expect(res.status).toEqual(400);
  });

  it("already connected", async () => {
    removeUser.mockReturnValue(true);
    const res = await withCookie(request(app).post("/api/remove-account"), {
      authenticated: true,
      username: "tom",
    });
    expect(res.status).toEqual(200);
  });

  it("already connected, database error", async () => {
    removeUser.mockReturnValue(false);
    const res = await withCookie(request(app).post("/api/remove-account"), {
      authenticated: true,
      username: "tom",
    });
    expect(res.status).toEqual(400);
  });
});
