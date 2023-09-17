const request = require('supertest');
// const { describe, it } = require('mocha');
const yup = require('yup');
const { expect } = require('chai');
const app = require('../app');
const jwt = require('jsonwebtoken');
const {JWT_SECRET, ACCESS_TOKEN_TIME} = require ('../constants')

const userCredentials = { email: 'tom@gmail.com', password: '123456' };
const TOKEN_VALIDATION_SCHEMA = yup.object({
  token: yup
    .string()
    .matches(/^(\w|-)+\.(\w|-)+\.(\w|-)+$/)
    .required(),
});

describe('app', () => {
  describe('public endpoints', () => {
    describe('POST /login', () => {
      it('response should be 200 {token: "fgdgfg.rhgfhf.rhtdhf"} Content-Type json when login/password valid', (done) => {
        request(app)
          .post('/user/login')
          .send(userCredentials)
          .expect(200)
          .expect('Content-Type', /json/)
          .then((res) => {
            expect(TOKEN_VALIDATION_SCHEMA.isValidSync(res.body)).to.be.true;
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
  describe('private endpoints', () => {
    let token;
    before((done) => {
      request(app)
        .post('/user/login')
        .send(userCredentials)
        .then((res) => {
          token = res.body.token;
          done();
        })
        .catch((err) => done(err));
    });
    describe('POST /getUser',
      () => {
        it('request should be 200 {req.body.email === userCredentials.email} Content-Type /json/ when valid user token, user exist', (done) => {
          request(app)
            .post('/user/getUser')
            .set('Authorization', token)
            .expect(200)
            .expect('Content-Type', /json/)
            .then((res) => {
              expect(res.body.email).to.equal(userCredentials.email);
              done();
            })
            .catch((err) => done(err));
        });
        it('request should be 408 ""need token" where token is missed', (done) => {
          request(app)
            .post('/user/getUser')
            .expect(408)
            .expect('need token')
            .end(done);
        });
        it('request should be 408 ""need error" where token is invalid', (done) => {
          request(app).post('/user/getUser').set('Authorization', 'token').expect(408).expect('token error').end(done);
        });
        it('request should be 408 "user did not exist" where user not find', (done) => {
          const fakeUserToken = jwt.sign({ userId: 0 }, JWT_SECRET, {expiresIn:ACCESS_TOKEN_TIME,})
          request(app)
            .post('/user/getUser')
            .set('Authorization', fakeUserToken)
            .expect(404)
            .expect('user with this data didnt exist')
            .end(done);
        });
      });
  });
});
