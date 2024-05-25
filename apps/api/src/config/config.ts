import { config as dotenvConfig } from 'dotenv';

export class Config {
  static readonly NODE_ENV = process.env.NODE_ENV || 'development';
  static readonly PORT = process.env.PORT || 3000;

  static readonly DB_HOST = process.env.DB_HOST || 'localhost';
  static readonly DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined || 5432;
  static readonly DB_USERNAME = process.env.DB_USERNAME || 'koray';
  static readonly DB_PASSWORD = process.env.DB_PASSWORD || 'DhdtG53euTkC9hfP';
  static readonly DB_DATABASE = process.env.DB_DATABASE || 'attendance';

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
