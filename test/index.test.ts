import request from "supertest";
import { basic } from "../src/shared/main";
import app from "../src/app";

describe("test server routes", () => {
  test("should return something in the test route", async () => {
    const res = await request(app).get("/test");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/hello/);
  });
});

describe("test shared library", () => {
  test("should return something when calling shared functions", () => {
    expect(basic()).toBeDefined();
  });
});
