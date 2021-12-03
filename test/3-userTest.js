const path = require('path');
var { should, assert } = require('chai')
require('dotenv').config({ path: path.resolve(__dirname, './../.env.test') });

const request = require('supertest');
const app = require('../app/index');
const { UserModel } = require('../app/models');
const userRepo = require('../app/repositories/userRepo');

let userId = null;

function getFormParams(object) {
    return new URLSearchParams(object).toString();
}

describe('Api', function () {
    // this.timeout(50000);

    const agent = request.agent(app).set('auth_basic', 'Basic c2hpZDoxMjM0NTY3OA==')
        .set("Accept", "application/json")
        .set("Content-Type", "text/html; charset=utf-8")
        .type('application/x-www-form-urlencoded')

    beforeEach(function (done) {
        userRepo.addNewUser({
            username: 'username',
            phone_number: '09138999000',
            password: '123456'
        }).then((data) => {
            user = data;
            done();
        }).catch(done);
    })

    // afterEach(function (done) {
    //   user.destroy({
    //     force: true,
    //   })
    //     .then(function () {
    //       done()
    //     })
    //     .catch(done)
    // })

    describe('user Api', function () {
        describe('Auth Routes', function () {

            it('login by user pass', (done) => {
                agent.post('/login').send(
                    "username=username&password=123456"
                ).expect((data) => {
                    agent.set({ Authorization: `Bearer ${data.body.data.token}` })
                }).expect(200, done);
            });

            it('update my credentials', (done) => {
                agent.post('/me/update').send(
                    getFormParams({
                        username: 'user1',
                        password: 'root20'
                    })
                ).expect({ status: true, message: '', data: [] }).expect(200, done);
            });

            it('getting my information', (done) => {
                agent.post('/me').expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

        })

        describe('address Routes', function () {

            let addressId = null;

            it('get roles', (done) => {
                agent.get(`/address`).expect(200, done);
            })

            it('create role', (done) => {
                agent.post(`/address`).send(
                    getFormParams({
                        name: 'address',
                        state: 'state',
                        city: 'city'
                    })
                ).expect((res) => {
                    addressId = res.body.data.id;
                }).expect(200, done);
            })

            it('update', (done) => {
                agent.get(`/address/${addressId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('company Info Routes', function () {

            let companyId = null;

            it('get roles', (done) => {
                agent.get(`/company`).expect(200, done);
            })

            it('create role', (done) => {
                agent.post(`/company`).send(
                    getFormParams({
                        name: 'address',
                        economic_code: 'economic code',
                        national_code: 'city',

                    })
                ).expect((res) => {
                    companyId = res.body.data.id;
                }).expect(200, done);
            })

            it('update', (done) => {
                agent.post(`/company/${companyId}`).send(
                    getFormParams({
                        name: 'address2',

                    })
                ).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('social Media Routes', function () {

            let socialMediaId = null;
            it('get roles', (done) => {
                agent.get(`/social-media`).expect(200, done);
            })
            it('create role', (done) => {
                agent.post(`/social-Media`).send(
                    getFormParams({
                        facebook: 'address',

                    })
                ).expect((res) => {
                    socialMediaId = res.body.data.id;
                }).expect(200, done);
            })
        })

        describe('other info Routes', function () {
            let infoId = null;
            it('get roles', (done) => {
                agent.get(`/info`).expect(200, done);
            })
            it('create role', (done) => {
                agent.post(`/info`).send(
                    getFormParams({
                        name: 'test',

                    })
                ).expect((res) => {
                    infoId = res.body.data.id;
                }).expect(200, done);
            })
        })

        describe('session Routes', function () {
            let sessionId = null;
            it('get sessions', (done) => {
                agent.get(`/session`).expect((res) => {
                    sessionId = res.body.data[0].id;
                }).expect(200, done);
            })
            it('block session', (done) => {
                agent.post(`/session/${sessionId}`).send(
                    getFormParams({
                        name: 'test',

                    })
                ).expect(200, done);
            })
        })


        describe('security Routes', function () {
            let sessionId = null;
            it('get sessions', (done) => {
                agent.get(`/security-questions`).expect((res) => {
                    sessionId = res.body.data[0].id;
                }).expect(200, done);
            })
            it('block session', (done) => {
                agent.post(`/security-answer`).send(
                    getFormParams({
                        security_question_id: sessionId,
                        answer: 'test'

                    })
                ).expect(200, done);
            })
            it('recovery by last password (recovery step 1)', (done) => {
                agent.post(`/recovery/by-last-password`).send(
                    getFormParams({
                        username: 'taheri',
                        last_password: 'taheri213',

                    })
                ).expect(200, done);
            })
            it('recovery  set new password (recovery step 2)', (done) => {
                agent.post(`/recovery/by-last-password`).send(
                    getFormParams({
                        username: 'taheri',
                        new_password: 'root10',
                        security_question_id: sessionId,
                        answer: 'test'

                    })
                ).expect(200, done);
            })
        })
    });
});