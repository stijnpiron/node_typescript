import { expect } from 'chai';
import AppInstance from '../server';
import User from '../user/user.interface';
import userModel from '../user/user.model';

describe('Authentication Controller tests', () => {
  let supertest: any = null;
  let testUser: User = null;
  // const path = '/api/auth';

  before(async () => {
    supertest = require('supertest')(AppInstance.getExpressInstance());
  });

  after(async () => {
    await userModel.findByIdAndDelete(testUser._id);
  });

  describe('response codes when not authorized', () => {
    context('/auth', () => {
      testUser = {
        name: 'Authentication Service Test User',
        email: 'authentication.service@testusers.com',
        password: 'Password1234',
        address: {
          street: 'Muntplein 1',
          city: '1000 Brussels',
          country: 'Belgium',
        },
      };

      context('/auth/2fa', () => {
        /*
         * it('POST /auth/2fa/generate - generateTwoFactorAuthenticationCode - 401', async () => {
         *   const res = await supertest.post('/auth/2fa/generate');
         *   expect(res.status).to.equal(401);
         * });
         * it('POST /auth/2fa/toggle - toggleTwoFactorAuthentication - 401', async () => {
         *   const res = await supertest.get('/auth/2fa/toggle');
         *   expect(res.status).to.equal(401);
         * });
         * it('POST /auth/2fa/authenticate - secondFactorAuthentication - 401', async () => {
         *   const res = await supertest.get('/auth/2fa/authenticate');
         *   expect(res.status).to.equal(401);
         * });
         */
      });

      it('POST /auth/register - register without payload - 400', async () => {
        const res = await supertest.post('/api/auth/register');
        expect(res.status).to.equal(400);
      });

      it('POST /auth/register - register with payload - 200', async () => {
        const res = await supertest.post('/api/auth/register').send(testUser);
        testUser = res.body;
        expect(res.status).to.equal(200);
      });

      it('POST /auth/login - login without payload - 400', async () => {
        const res = await supertest.post('/api/auth/login');
        expect(res.status).to.equal(400);
      });

      it('POST /auth/logout - logout - 200', async () => {
        const res = await supertest.post('/api/auth/logout');
        expect(res.status).to.equal(200);
      });
      /*
       * it('`GET` /auth - auth - 401', async () => {
       *   const res = await supertest.get('/auth');
       *   expect(res.status).to.equal(401);
       * });
       */
    });

    context('/post', () => {
      it('GET /post - getAllPosts - 200', async () => {
        const res = await supertest.get('/api/post');
        expect(res.status).to.equal(200);
      });

      it('GET /post/:id - getPostById - 401', async () => {
        const res = await supertest.get('/api/post/:id');
        expect(res.status).to.equal(401);
      });

      it('POST /post - createPost - 401', async () => {
        const res = await supertest.post('/api/post/:id');
        expect(res.status).to.equal(401);
      });

      it('PATCH /post/:id - modifyPost - 401', async () => {
        const res = await supertest.patch('/api/post/:id');
        expect(res.status).to.equal(401);
      });

      it('DELETE /post/:id - deletePost - 401', async () => {
        const res = await supertest.delete('/api/post/:id');
        expect(res.status).to.equal(401);
      });
    });

    context('/report', () => {
      it('GET /report - generateReport - 401', async () => {
        const res = await supertest.get('/api/report');
        expect(res.status).to.equal(401);
      });
    });

    context('/user', () => {
      it('GET /user/userId/posts - getAllPostsOfUser - 401', async () => {
        const res = await supertest.get('/api/user/userId/posts');
        expect(res.status).to.equal(401);
      });
    });
  });
});
