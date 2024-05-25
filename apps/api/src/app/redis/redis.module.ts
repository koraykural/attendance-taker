import Config from '@api/config/config';
import { FactoryProvider, Module, Provider } from '@nestjs/common';
import { Redis, Cluster } from 'ioredis';

const developmentRedisFactor: FactoryProvider['useFactory'] = () => {
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
};

const productionRedisFactor: FactoryProvider['useFactory'] = () => {
  const cluster = new Cluster(
    [
      {
        port: Config.REDIS_PORT,
        host: Config.REDIS_HOST,
      },
    ],
    {
      scaleReads: 'slave',
      dnsLookup: (address, callback) => callback(null, address),
      slotsRefreshTimeout: 2000,
      redisOptions: {
        tls: {},
      },
    }
  );

  cluster.on('connect', () => {
    console.log('Redis connected');
  });
  cluster.on('error', (err) => {
    console.log('Redis error', err);
  });

  return cluster;
};

const redisProvider: Provider = {
  provide: Redis,
  useFactory: Config.isProduction ? productionRedisFactor : developmentRedisFactor,
};

@Module({
  imports: [],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
