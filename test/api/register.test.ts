import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { initApp } from "../utils";

const createUser = vi.fn();
const app = initApp({ createUser });

async function register(body: {
  username?: string;
  password?: string;
}): Promise<request.Response> {
  return await request(app).post("/api/register").send(body);
}

describe("POST /register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("user creation", () => {
    it("missing username or password", async () => {
      let res = await register({ username: "bob" });
      expect(res.status).toEqual(400);
      res = await register({ password: "bob123" });
      expect(res.status).toEqual(400);
      res = await register({});
      expect(res.status).toEqual(400);
    });

    it("valid username and password", async () => {
      createUser.mockReturnValue({ acknowledged: true });
      const body = {
        username: "bob",
        password: "bob123",
      };
      const res = await register(body);
      expect(res.status).toEqual(200);
      expect(createUser.mock.calls[0][0]).toBe(body.username);
      expect(createUser.mock.calls[0][1]).toBe(body.password);
    });

    it("database error", async () => {
      createUser.mockReturnValue({ acknowledged: false });
      const res = await register({ username: "bob", password: "bob123" });
      expect(res.status).toEqual(400);
    });
  });
});
