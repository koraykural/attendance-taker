import { config as dotenvConfig } from 'dotenv';

const getIntVar = (name: string, defaultValue: number): number => {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  return parseInt(value);
};

class Config {
  readonly NODE_ENV: 'development' | 'production';
  readonly PORT: number;

  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_USERNAME: string;
  readonly DB_PASSWORD: string;
  readonly DB_DATABASE: string;

  readonly REDIS_HOST: string;
  readonly REDIS_PORT: number;

  constructor() {
    if (process.env.api_secrets) {
      const secrets = JSON.parse(process.env.api_secrets);
      Object.assign(process.env, secrets);
    } else {
      console.log('Loading config from .env file.');
      dotenvConfig();
    }

    if (process.env.NODE_ENV === 'production') {
      this.NODE_ENV = 'production';
    } else {
      this.NODE_ENV = 'development';
    }

    this.PORT = getIntVar('PORT', 3333);

    this.DB_HOST = process.env.DB_HOST || 'localhost';
    this.DB_PORT = getIntVar('DB_PORT', 5432);
    this.DB_USERNAME = process.env.DB_USERNAME || 'koray';
    this.DB_PASSWORD = process.env.DB_PASSWORD || 'DhdtG53euTkC9hfP';
    this.DB_DATABASE = process.env.DB_DATABASE || 'attendance';

    this.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
    this.REDIS_PORT = getIntVar('REDIS_PORT', 6379);
  }

  get isProduction() {
    return this.NODE_ENV === 'production';
  }

  get isDevelopment() {
    return this.NODE_ENV === 'development';
  }
}

export default new Config();
