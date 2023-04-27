import { Module, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';

const redisProvider: Provider = {
  provide: Redis,
  useFactory: () => {
    const client = new Redis({
      port: 6379,
      host: '127.0.0.1',
      username: 'default',
      password: 'my-top-secret',
      db: 0,
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
