const request = require("supertest");
const { expect } = require("chai");

describe("Login API", () => {
    describe("POST /login", () => {
        it("should return status 200 when login with valid credentials", async () => {
            const response = await request("http://localhost:3000")
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                //                .set("Authorization", "Basic Y2FybG9zOjEyMw==")
                .send({
                    usuario: "carlos",
                    senha: "123",
                });
            expect(response.status).to.equal(200);            
            expect(response.body).to.have.property("token").to.be.a("string");
        });
        it("should return 401 with invalid credentials", async () => {
            const response = await request("http://localhost:3000")
                .post("/api/auth/login")
                .send({
                    usuario: "carlos",
                    senha: "1234",
                });
            expect(response.status).to.equal(401);
        });
    });
});
