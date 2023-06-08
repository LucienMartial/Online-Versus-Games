import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { initApp } from "../utils";
import { ObjectId } from "mongodb";
import { AppError } from "../../app-server/utils/error";

const searchUser = vi.fn();
const getGames = vi.fn();
const app = initApp({ searchUser, discWar: { getGames } });

function games(): Promise<request.Response> {
  return request(app).get("/api/history/riri");
}

describe("GET /games", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get games", () => {
    it("user does not exist", async () => {
      searchUser.mockReturnValue(null);
      const res = await games();
      expect(res.status).toEqual(400);
      expect(res.body.message).toBeDefined();
    });

    it("error while fetching game", async () => {
      searchUser.mockReturnValue({ _id: new ObjectId(0) });
      getGames.mockRejectedValue(
        new AppError(500, "Error while fetching game"),
      );
      const res = await games();
      expect(res.status).toEqual(500);
      expect(res.body.message).toBeDefined();
    });

    it("could fetch games correctly", async () => {
      searchUser.mockReturnValue({ _id: new ObjectId(0) });
      getGames.mockReturnValue([]);
      const res = await games();
      expect(res.status).toEqual(200);
      expect(res.body).toEqual([]);
    });
  });
});
