import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { initApp, withCookie } from "../utils";
import { ObjectId } from "mongodb";
import { Login } from "../../app-shared/types";

const matchPassword = vi.fn();
const searchUser = vi.fn();
const app = initApp({ matchPassword, searchUser });

async function login(body: {
  username?: string;
  password?: string;
}): Promise<request.Response> {
  return await request(app).post("/api/login").send(body);
}

// manual login with data

describe("POST /login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchUser.mockReturnValue({ _id: new ObjectId(0), password: "hey" });
  });

  describe("user login", () => {
    it("valid username and password", async () => {
      matchPassword.mockReturnValue(true);
      const res = await login({ username: "john", password: "john13" });
      const data: Login = res.body;
      expect(data.id).toBeDefined();
      expect(res.status).toEqual(200);
    });

    it("missing username or password", async () => {
      let res = await login({ username: "john" });
      expect(res.status).toEqual(400);
      res = await login({ password: "john13" });
      expect(res.status).toEqual(400);
      res = await login({});
      expect(res.status).toEqual(400);
    });

    it("password not matching", async () => {
      matchPassword.mockReturnValue(false);
      const res = await login({ username: "john", password: "john13" });
      expect(res.status).toEqual(400);
    });

    it("already connected", async () => {
      const res = await withCookie(request(app).post("/api/login"), {
        authenticated: true,
      });
      expect(res.status).toEqual(200);
    });
  });
});

// check session to see if already connected

describe("GET /cookie-checker", () => {
  it("already authenticated", async () => {
    const res = await withCookie(request(app).get("/api/cookie-checker"), {
      authenticated: true,
    });
    expect(res.status).toEqual(200);
  });

  it("not authenticated", async () => {
    const res = await request(app).get("/api/cookie-checker");
    expect(res.status).toEqual(400);
  });
});
