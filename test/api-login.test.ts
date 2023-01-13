import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../index";
import { Login } from "../app-shared/types/api.js";

describe("login request", () => {
    it("check message integrity", async () => {
        const payload = { username: 'john' };
        const res = await request(app)
            .post('/api/login')
            .send(payload)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.status).toEqual(200);
        const loginPayload: Login = JSON.parse(res.text);
        expect(loginPayload.username).toEqual("john");
    });
});