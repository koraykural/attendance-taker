import { Config } from '@api/config/config';
import { Module, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

const redisProvider: Provider = {
  provide: Redis,
  useFactory: () => {
    const client = new Redis({
      port: Config.REDIS_PORT,
      host: Config.REDIS_HOST,
    });
    client.on('connect', () => {
      console.log('Redis connected');
    });
    client.on('error', (err) => {
      console.log('Redis error', err);
    });
    return client;
  },
};

@Module({
  imports: [],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
