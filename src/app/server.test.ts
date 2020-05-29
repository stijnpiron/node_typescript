import { expect } from 'chai';
import AppInstance from './server';

describe('Server test', () => {
  let supertest: any = null;

  before(async () => {
    supertest = require('supertest')(AppInstance.getExpressInstance());
  });

  it('tests the base route and returns true for status', async () => {
    const res = await supertest.get('/api');
    expect(res.status).to.equal(200);
    expect(res.body).not.to.be.empty;
  });
});
