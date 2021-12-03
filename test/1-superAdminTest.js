const path = require('path');
var { should, assert } = require('chai')
require('dotenv').config({ path: path.resolve(__dirname, './../.env.test') });

const request = require('supertest');
const app = require('../app/index');
const { UserModel } = require('../app/models');
const userRepo = require('../app/repositories/superAdminRepo');

let user = null;
let serviceId = null;
let adminId = null;
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
    userRepo.addNew({
      username: 'username',
      phone_number: '09138999000',
      password: '123456'
    }).then((data) => {
      user = data;
      return done()
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

  describe('Super Admin Api', function () {
    describe('Auth Routes', function () {

      it('login by user pass', (done) => {
        agent.post('/super-admin/login').send(
          "username=username&password=123456"
        ).expect((data) => {
          agent.set({ Authorization: `Bearer ${data.body.data.token}` })
        }).expect(200, done);
      });

      it('update my credentials', (done) => {
        agent.post('/super-admin/me/update').send(
          getFormParams({
            username: 'user1',
            password: 'root20'
          })
        ).expect({ status: true, message: '', data: [] }).expect(200, done);
      });

      it('getting my information', (done) => {
        agent.post('/super-admin/me').expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

    })

    describe('Service Routes', function () {

      it('login by user pass', (done) => {
        agent.post('/super-admin/service/').expect((res) => {
          return assert.equal(res.body.status, true)
        }).expect(200, done);
      });

      it('update my credentials', (done) => {
        agent.post('/super-admin/service/new').send(
          getFormParams({
            name: 'club0',
          })
        ).expect((res) => {
          serviceId = res.body.data.service.id;
          return assert.equal(res.body.status, true)
        }).expect(200, done);
      });

      it('getting my information', (done) => {
        agent.get(`/super-admin/service/${serviceId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('getting my information', (done) => {
        agent.post(`/super-admin/service/${serviceId}`).send(
          getFormParams({
            name: 'club-updated',
          })
        ).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });
    })

    describe('admin management Routes', function () {

      it('get all', (done) => {
        agent.post('/super-admin/admins/').expect((res) => {
          return assert.equal(res.body.status, true)
        }).expect(200, done);
      });

      it('create', (done) => {
        agent.post('/super-admin/admins/new').send(
          getFormParams({
            username: 'alex3',
            password: 'alex123421312312',
            phone_number: '09447788172',
            service_id: serviceId,
          })
        ).expect((res) => {
          adminId = res.body.data.admin.id;
          return assert.equal(res.body.status, true)
        }).expect(200, done);
      });

      it('getting information', (done) => {
        agent.get(`/super-admin/admins/${adminId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('update', (done) => {
        agent.post(`/super-admin/admins/${adminId}`).send(
          getFormParams({
            username: 'alex-updated',
            password: 'alex3',
          })
        ).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });
    })

    describe('user management Routes', function () {

      let walletId = null;
      let roleId = null;

      it('create role', (done) => {
        agent.post(`/super-admin/role/new`).send(
          getFormParams({
            name: 'role-name',
            service_id: serviceId,
            is_permission: false
          })
        ).expect((res) => {
          roleId = res.body.data.id;
        }).expect(200, done);
      })
      it('create user', (done) => {
        agent.post(`/register/${roleId}/${serviceId}`).send(
          getFormParams({
            username: 'user1',
            password: '12348688',
            phone_number: '09885632217'
          })
        ).expect((res) => {
          userId = res.body.data.wallet.userable_id;
          walletId = res.body.data.wallet.id;

          return assert.equal(res.body.status, true)
        }).expect(200, done);
      })
      it('get all', (done) => {
        agent.post('/super-admin/users/').expect((res) => {
          return assert.equal(res.body.status, true)
        }).expect(200, done);
      });

      it('getting information', (done) => {
        agent.get(`/super-admin/users/${userId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('update', (done) => {
        agent.post(`/super-admin/users/${userId}`).send(
          getFormParams({
            username: 'alex-updated',
            password: 'alex3',
          })
        ).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('get user By WalletId', (done) => {
        agent.get(`/super-admin/users/user-by-wallet/${walletId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });
    })
    
    describe('role Routes', function () {

      let walletId = null;
      let roleId = null;
      it('get roles', (done) => {
        agent.post(`/super-admin/role`).expect((res) => {
          roleId = res.body.data.id;
        }).expect(200, done);
      })
      it('create role', (done) => {
        agent.post(`/super-admin/role/new`).send(
          getFormParams({
            name: 'role-name1',
            service_id: serviceId,
            is_permission: true
          })
        ).expect((res) => {
          roleId = res.body.data.id;
        }).expect(200, done);
      })

      it('create user', (done) => {
        agent.post(`/super-admin/role/${roleId}`).expect(200, done);
      })

      it('update', (done) => {
        agent.post(`/super-admin/role/${roleId}/set-role-to-user`).send(
          getFormParams({
            user_id: userId,
          })
        ).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('remove role from user', (done) => {
        agent.post(`/super-admin/role/${roleId}/remove-role-from-user`).send(
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
      it('get my address', (done) => {
        agent.get(`/super-admin/address/my`).expect(200, done);
      })
      it('create', (done) => {
        agent.post(`/super-admin/address/my`).send(
          getFormParams({
            name: 'address',
            state: 'state',
            city: 'city'
          })
        ).expect((res) => {
          addressId = res.body.data.id;
        }).expect(200, done);
      })

      it('get all', (done) => {
        agent.post(`/super-admin/address`).expect(200, done);
      })

      it('get one', (done) => {
        agent.get(`/super-admin/address/${addressId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('update', (done) => {
        agent.post(`/super-admin/address/${addressId}`).send(
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
      it('get my company', (done) => {
        agent.get(`/super-admin/company/my`).expect(200, done);
      })
      it('create', (done) => {
        agent.post(`/super-admin/company/my`).send(
          getFormParams({
            name: 'address',
            economic_code: 'economic code',
            national_code: 'city',

          })
        ).expect((res) => {
          companyId = res.body.data.id;
        }).expect(200, done);
      })

      it('get all', (done) => {
        agent.post(`/super-admin/company/`).expect(200, done);
      })

      it('get one', (done) => {
        agent.get(`/super-admin/company/${companyId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('update', (done) => {
        agent.post(`/super-admin/company/${companyId}`).send(
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
      it('get my social media', (done) => {
        agent.get(`/super-admin/social-media/my`).expect(200, done);
      })
      it('set my socail media', (done) => {
        agent.post(`/super-admin/social-Media/my`).send(
          getFormParams({
            facebook: 'address',

          })
        ).expect((res) => {
          socialMediaId = res.body.data.id;
        }).expect(200, done);
      })

      it('create', (done) => {
        agent.post(`/super-admin/social-Media/`).expect(200, done);
      })

      it('get one', (done) => {
        agent.get(`/super-admin/social-Media/${socialMediaId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('update', (done) => {
        agent.post(`/super-admin/social-Media/${socialMediaId}`).send(
          getFormParams({
            facebook: 'address2',

          })
        ).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });
    })
    
    describe('security Questions Routes', function () {

      let questionId = null;
      it('get all', (done) => {
        agent.get(`/super-admin/security-question`).expect(200, done);
      })
      it('create', (done) => {
        agent.post(`/super-admin/security-question`).send(
          getFormParams({
            question: 'what is your favorite book?',

          })
        ).expect((res) => {
          questionId = res.body.data.id;
        }).expect(200, done);
      })

      it('update', (done) => {
        agent.post(`/super-admin/security-question/${questionId}`).send(
          getFormParams({
            question: 'what is your favorite books?',

          })
        ).expect(200, done);
      })
    })

    describe('other info Routes', function () {
      let infoId = null;
      it('get roles', (done) => {
        agent.get(`/super-admin/info/my`).expect(200, done);
      })
      it('create role', (done) => {
        agent.post(`/super-admin/info/my`).send(
          getFormParams({
            name: 'test',

          })
        ).expect((res) => {
          infoId = res.body.data.id;
        }).expect(200, done);
      })

      it('create user', (done) => {
        agent.post(`/super-admin/info/`).expect(200, done);
      })

      it('update', (done) => {
        agent.get(`/super-admin/info/${infoId}`).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });

      it('update', (done) => {
        agent.post(`/super-admin/info/${infoId}`).send(
          getFormParams({
            facebook: 'address2',

          })
        ).expect((res) => {
          return assert.equal(res.body.status, true)
        })
          .expect(200, done);
      });
    })
  });
});