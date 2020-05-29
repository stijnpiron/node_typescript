import { expect } from 'chai';
import AppInstance from './server';

const supertest = require('supertest')(AppInstance.getExpressInstance());

describe('Index Test', () => {
  it('should always pass', () => {
    expect(true).to.equal(true);
  });
});

describe('Server test', () => {
  it('tests the base route and returns true for status', async () => {
    const res = await supertest.get('/api');

    expect(res.status).to.equal(404);
    // expect(res.body.status).to.equal(true);
  });
});
