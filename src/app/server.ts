import 'dotenv/config';
import App from './app';
import AuthenticationController from './authentication/authentication.controller';
import PostController from './post/post.controller';
import UserController from './user/user.controller';
import validateEnv from './utils/validateEnv';
import ReportController from './report/report.controller';
import ApiController from './api/api.controller';

validateEnv();

const app = new App([
  new ApiController(),
  new PostController(),
  new AuthenticationController(),
  new UserController(),
  new ReportController(),
]);

export default app;
