const { expect } = require("chai");
const { loginResponse } = require("../utils/utils");

describe("Login API", () => {
    describe("POST /login", () => {
        it("should return status 200 when login with valid credentials", async () => {
            const response = await loginResponse('carlos', '123');

            expect(response.status).to.equal(200);            
            expect(response.body).to.have.property("token").to.be.a("string");
        });
        it("should return 401 with invalid credentials", async () => {
            const response = await loginResponse('carlosABC', '1234Xyx');
            expect(response.body).to.have.property('mensagem').to.equal('Credenciais inválidas');
            expect(response.status).to.equal(401);
        });
    });
});
