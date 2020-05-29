import { cleanEnv, port, str, num } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    JWT_TTL: num(),
    LOG_MORGAN: str(),
    MONGO_DB: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    PORT: port(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: str(),
  });
}

export default validateEnv;
