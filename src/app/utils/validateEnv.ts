import { cleanEnv, port, str, num } from 'envalid';

function validateEnv() {
  cleanEnv(process.env, {
    JWT_SECRET: str(),
    JWT_TTL: num(),
    MONGO_DB: str(),
    MONGO_PASSWORD: str(),
    MONGO_PATH: str(),
    MONGO_USER: str(),
    SERVER_PORT: port(),
    TWO_FACTOR_AUTHENTICATION_APP_NAME: str(),
  });
}

export default validateEnv;
