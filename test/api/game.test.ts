import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { initApp } from "../utils";

const createUser = vi.fn();
const app = initApp({ createUser });

describe("GET /games", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get games", () => {
    it.todo("hey");
  });
});
