const path = require('path');
var { should, assert } = require('chai')
require('dotenv').config({ path: path.resolve(__dirname, './../.env.test') });

const request = require('supertest');
const app = require('../app/index');
const { UserModel } = require('../app/models');
const userRepo = require('../app/repositories/adminRepo');
const userRoleRepo = require('../app/repositories/adminRepo');

let user = null;
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
        userRepo.addNewAdmin({
            username: 'username',
            phone_number: '09138999000',
            password: '123456',
            email: 'test@test.com'
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

    describe('Admin Api', function () {
        describe('Auth Routes', function () {

            it('login by user pass', (done) => {
                agent.post('/admin/login').send(
                    "username=username&password=123456"
                ).expect((data) => {
                    agent.set({ Authorization: `Bearer ${data.body.data.token}` })
                }).expect(200, done);
            });

            it('update my credentials', (done) => {
                agent.post('/admin/me/update').send(
                    getFormParams({
                        username: 'user1',
                        password: 'root20'
                    })
                ).expect({ status: true, message: '', data: [] }).expect(200, done);
            });

            it('getting my information', (done) => {
                agent.post('/admin/me').expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

        })

        describe('user management Routes', function () {

            let walletId = null;

            it('get all', (done) => {
                agent.post('/admin/users/').expect((res) => {
                    userId = res.body.data[0].id;
                    return assert.equal(res.body.status, true)
                }).expect(200, done);
            });

            it('getting information', (done) => {
                agent.get(`/admin/users/${userId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });


            it('get user By WalletId', (done) => {
                userRoleRepo.findByRoleAndUserId(userId).then((data) => {
                    walletId = data.walletId;
                    agent.get(`/admin/users/user-by-wallet/${walletId}`).expect((res) => {
                        return assert.equal(res.body.status, true)
                    })
                        .expect(200, done);
                })
            });

            it('block user with wallet id', (done) => {
                agent.post(`/admin/users/wallet/${walletId}/block`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('un block user with wallet id', (done) => {
                agent.post(`/admin/users/wallet/${walletId}/unblock`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('get black list', (done) => {
                agent.get(`/admin/users/wallet/black-list`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('role Routes', function () {

            let roleId = null;
            it('get roles', (done) => {
                agent.post(`/admin/role`).expect((res) => {
                    roleId = res.body.data.id;
                }).expect(200, done);
            })
            it('create role', (done) => {
                agent.post(`/admin/role/new`).send(
                    getFormParams({
                        name: 'role-name1',
                        is_permission: true
                    })
                ).expect((res) => {
                    roleId = res.body.data.id;
                }).expect(200, done);
            })

            it('create user', (done) => {
                agent.post(`/admin/role/${roleId}`).expect(200, done);
            })

            it('update', (done) => {
                agent.post(`/admin/role/${roleId}/set-role-to-user`).send(
                    getFormParams({
                        user_id: userId,
                    })
                ).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('update', (done) => {
                agent.post(`/admin/role/${roleId}/remove-role-from-user`).send(
                    getFormParams({
                        user_id: userId,
                    })
                ).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('address Routes', function () {

            let addressId = null;

            it('get roles', (done) => {
                agent.get(`/admin/address/my`).expect(200, done);
            })

            it('create role', (done) => {
                agent.post(`/admin/address/my`).send(
                    getFormParams({
                        name: 'address',
                        state: 'state',
                        city: 'city'
                    })
                ).expect((res) => {
                    addressId = res.body.data.id;
                }).expect(200, done);
            })

            it('create user', (done) => {
                agent.post(`/admin/address`).expect(200, done);
            })

            it('update', (done) => {
                agent.get(`/admin/address/${addressId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('update', (done) => {
                agent.post(`/admin/address/${addressId}`).send(
                    getFormParams({
                        name: 'test',
                    })
                ).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('company Info Routes', function () {

            let companyId = null;

            it('get roles', (done) => {
                agent.get(`/admin/company/my`).expect(200, done);
            })

            it('create role', (done) => {
                agent.post(`/admin/company/my`).send(
                    getFormParams({
                        name: 'address',
                        economic_code: 'economic code',
                        national_code: 'city',

                    })
                ).expect((res) => {
                    companyId = res.body.data.id;
                }).expect(200, done);
            })

            it('create user', (done) => {
                agent.post(`/admin/company/`).expect(200, done);
            })

            it('update', (done) => {
                agent.get(`/admin/company/${companyId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('update', (done) => {
                agent.post(`/admin/company/${companyId}`).send(
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
                agent.get(`/admin/social-media/my`).expect(200, done);
            })
            it('create role', (done) => {
                agent.post(`/admin/social-Media/my`).send(
                    getFormParams({
                        facebook: 'address',

                    })
                ).expect((res) => {
                    socialMediaId = res.body.data.id;
                }).expect(200, done);
            })

            it('create user', (done) => {
                agent.post(`/admin/social-Media/`).expect(200, done);
            })

            it('update', (done) => {
                agent.get(`/admin/social-Media/${socialMediaId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('update', (done) => {
                agent.post(`/admin/social-Media/${socialMediaId}`).send(
                    getFormParams({
                        facebook: 'address2',

                    })
                ).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('other info Routes', function () {
            let infoId = null;
            it('get roles', (done) => {
                agent.get(`/admin/info/my`).expect(200, done);
            })
            it('create role', (done) => {
                agent.post(`/admin/info/my`).send(
                    getFormParams({
                        name: 'test',

                    })
                ).expect((res) => {
                    infoId = res.body.data.id;
                }).expect(200, done);
            })

            it('create user', (done) => {
                agent.post(`/admin/info/`).expect(200, done);
            })

            it('update', (done) => {
                agent.get(`/admin/info/${infoId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });

            it('update', (done) => {
                agent.post(`/admin/info/${infoId}`).send(
                    getFormParams({
                        facebook: 'address2',

                    })
                ).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })

        describe('session Routes', function () {
            let sessionId = null;
            it('get sessions', (done) => {
                agent.get(`/admin/session`).expect((res) => {
                    sessionId = res.body.data[0].id;
                }).expect(200, done);
            })
            it('block session', (done) => {
                agent.post(`/admin/session/${sessionId}`).send(
                    getFormParams({
                        name: 'test',

                    })
                ).expect(200, done);
            })

            it('update', (done) => {
                agent.delete(`/admin/session/${sessionId}`).expect((res) => {
                    return assert.equal(res.body.status, true)
                })
                    .expect(200, done);
            });
        })
    });
});