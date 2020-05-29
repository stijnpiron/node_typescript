import { expect } from 'chai';
import AppInstance from '../server';

describe('Post Controller tests', () => {
  let supertest: any = null;
  const path = '/api/post';

  before(async () => {
    supertest = require('supertest')(AppInstance.getExpressInstance());
  });

  // TODO: create new user to test with for properties
  describe('GET /api/post', () => {
    let res: any = null;

    before(async () => {
      res = await supertest.get(path);
    });

    it('responds with json', (done) => {
      supertest.get(path).set('Accept', 'application/json').expect('Content-Type', /json/).expect(200, done);
    });

    it(`tests the base route and returns true for status`, async () => {
      expect(res.status).to.equal(200);
      expect(res.body.length).to.be.greaterThan(0);
      expect(res.body[0]).to.haveOwnProperty('_id');
    });

    it('tests if the body is of type array', () => {
      expect(res.body).to.be.an('array');
    });

    context(`tests if returned body has posts that have desired properties`, async () => {
      it('_id', () => {
        for (const post of res.body) expect(post).to.haveOwnProperty('_id').not.to.be.empty;
      });

      it('author', () => {
        for (const post of res.body) expect(post).to.haveOwnProperty('author').not.to.be.empty;
      });

      it('content', () => {
        for (const post of res.body) expect(post).to.haveOwnProperty('content').not.to.be.empty;
      });

      it('title', () => {
        for (const post of res.body) expect(post).to.haveOwnProperty('title').not.to.be.empty;
      });
    });

    // TODO: should this not be a test of the post service?
    context('check for sensitive information', () => {
      it(`tests if posts have author, but don't include password`, () => {
        for (const post of res.body) expect(post.author).not.to.have.ownProperty('password');
      });

      it(`tests if posts have author, but don't include twoFactorAuthenticationCode`, () => {
        for (const post of res.body) expect(post.author).not.to.have.ownProperty('twoFactorAuthenticationCode');
      });

      it(`tests if posts have author, but don't include isTwoFactorAuthenticationEnabled`, () => {
        for (const post of res.body) expect(post.author).not.to.have.ownProperty('isTwoFactorAuthenticationEnabled');
      });
    });
  });
});
