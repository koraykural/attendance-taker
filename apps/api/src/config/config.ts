import { config as dotenvConfig } from 'dotenv';

const getIntVar = (name: string, defaultValue: number): number => {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }
  return parseInt(value);
};

export class Config {
  static readonly NODE_ENV = process.env.NODE_ENV || 'development';
  static readonly PORT = process.env.PORT || 3000;

  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = getIntVar('DB_PORT', 5432);
  static readonly DB_USERNAME = process.env.DB_USERNAME || 'koray';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'DhdtG53euTkC9hfP';
  static readonly DB_DATABASE = process.env.DB_DATABASE || 'attendance';

  static readonly REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  static readonly REDIS_PORT = getIntVar('REDIS_PORT', 6379);

  static _initialize() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Loading config from .env file.');
      dotenvConfig();
    }

    if (process.env.api_secrets) {
      const secrets = JSON.parse(process.env.api_secrets);
      Object.assign(Config, secrets);
    }
  }
}

Config._initialize();
