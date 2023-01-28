import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { initApp, withCookie } from "../utils";
import { FriendsRequestsData, User, UserTarget } from "../../app-shared/types";
import { ObjectId } from "mongodb";

const getFriendsAndRequests = vi.fn();
const searchUser = vi.fn();
const removeFriend = vi.fn();
const addFriendRequest = vi.fn();
const removeFriendRequest = vi.fn();
const acceptFriendRequest = vi.fn();
const app = initApp({
  getFriendsAndRequests,
  addFriendRequest,
  removeFriend,
  searchUser,
  removeFriendRequest,
  acceptFriendRequest,
});

describe("GET /friends", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get friends data", () => {
    it("cookies not valid", async () => {
      const res = await request(app).get("/api/friends");
      expect(res.status).toEqual(400);
      expect(res.body.message).toBeDefined();
    });

    it("database could not fetch data", async () => {
      getFriendsAndRequests.mockReturnValue(null);
      const res = await withCookie(request(app).get("/api/friends"), {
        id: 0,
        username: "riri",
        authenticated: true,
      });
      expect(res.status).toEqual(500);
      expect(res.body.message).toBeDefined();
    });

    it("valid request", async () => {
      getFriendsAndRequests.mockReturnValue({} as FriendsRequestsData);
      const res = await withCookie(request(app).get("/api/friends"), {
        id: 0,
        username: "riri",
        authenticated: true,
      });
      expect(res.status).toEqual(200);
      expect(res.body).toBeDefined();
    });
  });
});

/**
 * Remove friend
 */

function nonValidCookieRequest(path: string) {
  it("cookies not valid", async () => {
    const res = await request(app).post(path);
    expect(res.status).toEqual(400);
    expect(res.body.message).toBeDefined();
  });
}

function userNotProvided(path: string) {
  it("user not provided", async () => {
    const res = await withCookie(request(app).post(path), {
      id: 0,
      authenticated: true,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toBeDefined();
  });
}

function userNotExisting(path: string) {
  it("user not valid", async () => {
    searchUser.mockReturnValue(null);
    const data: UserTarget = { username: "john" };
    const res = await withCookie(request(app).post(path).send(data), {
      id: 0,
      username: "riri",
      authenticated: true,
    });
    expect(res.status).toEqual(404);
    expect(res.body.message).toBeDefined();
  });
}

describe("POST /friends/remove", () => {
  nonValidCookieRequest("/api/friends/remove");
  userNotProvided("/api/friends/remove");
  userNotExisting("/api/friends/remove");

  it("no user given", async () => {
    const res = await withCookie(request(app).post("/api/friends/remove"), {
      id: 0,
      username: "riri",
      authenticated: true,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toBeDefined();
  });
});

/**
 * Friend Requests
 */

describe("POST /friends/request-add", () => {
  nonValidCookieRequest("/api/friends/request-add");
  userNotProvided("/api/friends/request-add");
  userNotExisting("/api/friends/request-add");

  it("server error", async () => {
    addFriendRequest.mockReturnValue(null);
    searchUser.mockReturnValue(new ObjectId());
    const data: UserTarget = { username: "john" };
    const res = await withCookie(
      request(app).post("/api/friends/request-add").send(data),
      {
        id: 0,
        username: "riri",
        authenticated: true,
      }
    );
    expect(res.status).toEqual(500);
    expect(res.body.message).toBeDefined();
  });

  it("working correctly", async () => {
    addFriendRequest.mockReturnValue(new ObjectId());
    searchUser.mockReturnValue({} as User);
    const data: UserTarget = { username: "john" };
    const res = await withCookie(
      request(app).post("/api/friends/request-add").send(data),
      {
        id: 0,
        username: "riri",
        authenticated: true,
      }
    );
    expect(res.status).toEqual(200);
    expect(res.body).toBeTypeOf("string");
  });
});

describe("POST /friends/request-accept", () => {
  nonValidCookieRequest("/api/friends/request-accept");
});

describe("POST /friends/request-remove", () => {
  nonValidCookieRequest("/api/friends/request-remove");
});
