const request = require("supertest");
const { expect } = require("chai");
const {loginResponse} = require("../utils/utils");

describe('Pacients', () => {
    describe('GET /pacientes', () => {
        it('Should show status 200 and list all pacients', async () => {
            
            const loginResp = await loginResponse('carlos', '123');
            
            const response = await request("http://localhost:3000")
                .get("/api/pacientes")
                .set('Authorization', `Bearer ${loginResp.body.token}`);
            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('array');
        });
        it('Should show status 401 when not authenticated', async () => {
            const response = await request("http://localhost:3000")
                .get("/api/pacientes")
                .set('Authorization', `Bearer 123`);

            expect(response.body).to.have.property('mensagem').to.equal('Token inválido');
            expect(response.status).to.equal(401);
        });
    });

});