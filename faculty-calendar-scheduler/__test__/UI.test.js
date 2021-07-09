let chai = require('chai');
let chaiHttp = require('chai-http');
const { request } = require('express');
let expect = chai.expect;
chai.use(chaiHttp);

describe('Testing my Post method', () => {
    it('should be return status 200 for /', function (done) {
        chai
            .request('http://localhost:3000')
            .post('/verify_code')
            .then(function (res) {
                expect(res).to.have.status(200);
                done();
            })
            .catch(function (err) {
                throw (err);
            });
    }, 30000);
});