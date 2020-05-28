import AuthenticationService from '../../app/authentication/authentication.service';
import TokenData from 'interfaces/tokenData.interface';
import { expect } from 'chai';

describe('The AuthenticationService', () => {
  const authenticationService = new AuthenticationService();
  describe('When creating a cookie', () => {
    const tokenData: TokenData = {
      token: '',
      expiresIn: 0,
    };
    it('should return a string', () => {
      expect(typeof authenticationService.createCookie(tokenData)).to.equal('string');
    });
  });
});
