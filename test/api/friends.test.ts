import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { initApp, withCookie } from "../utils";

const getFriendsAndRequests = vi.fn();
const removeFriend = vi.fn();
const sendFriendRequest = vi.fn();
const removeFriendRequest = vi.fn();
const acceptFriendRequest = vi.fn();
const app = initApp({
  getFriendsAndRequests,
  sendFriendRequest,
  removeFriend,
  removeFriendRequest,
  acceptFriendRequest,
});

async function nonValidCookieRequest(path: string) {
  const res = await request(app).get(path);
  expect(res.status).toEqual(400);
  expect(res.body.message).toBeDefined();
}

describe("GET /friends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get friends data", () => {
    it("cookies not valid", async () => {
      nonValidCookieRequest("/api/friends");
    });

    it("database could not fetch data", async () => {
      getFriendsAndRequests.mockReturnValue(null);
      const res = await withCookie(request(app).get("/api/friends"), {
        id: "hey",
        authenticated: true,
      });
      expect(res.status).toEqual(500);
      expect(res.body.message).toBeDefined();
    });

    it("valid request", async () => {
      getFriendsAndRequests.mockReturnValue({ value: "data" });
      const res = await withCookie(request(app).get("/api/friends"), {
        id: "hey",
        authenticated: true,
      });
      expect(res.status).toEqual(200);
      expect(res.body).toEqual("data");
    });
  });
});

/**
 * Remove friend
 */

describe("POST /friends/remove", () => {
  it("cookies not valid", async () => {
    const res = await request(app).post("/api/friends/remove");
    expect(res.status).toEqual(400);
    expect(res.body.message).toBeDefined();
  });

  it("no user given", async () => {
    const res = await withCookie(request(app).post("/api/friends/remove"), {
      id: "hey",
      authenticated: true,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toBeDefined();
  });

  //   it("user given does not exist", async () => {});
});

/**
 * Friend Requests
 */

describe("POST /friends/request-add", () => {
  it("cookies not valid", async () => {
    nonValidCookieRequest("/api/friends/request-add");
  });

  it("no user given", async () => {
    const res = await withCookie(request(app).post("/api/friends/remove"), {
      id: "hey",
      authenticated: true,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toBeDefined();
  });
});

describe("POST /friends/request-accept", () => {
  it("cookies not valid", async () => {
    nonValidCookieRequest("/api/friends/request-accept");
  });
});

describe("POST /friends/request-remove", () => {
  it("cookies not valid", async () => {
    nonValidCookieRequest("/api/friends/request-remove");
  });
});
