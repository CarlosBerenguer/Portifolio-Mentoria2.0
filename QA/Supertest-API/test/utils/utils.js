const request = require("supertest");
const { expect } = require("chai");

async function loginResponse(username, password) {

    const response = await request("http://localhost:3000")
        .post("/api/auth/login")
        .set("Content-Type", "application/json")
        //                .set("Authorization", "Basic Y2FybG9zOjEyMw==")
        .send({
            usuario: username,
            senha: password,
        });
    return response;
}
module.exports = { loginResponse };

