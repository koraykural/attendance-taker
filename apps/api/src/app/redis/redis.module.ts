import Config from '@api/config/config';
import { FactoryProvider, Module, Provider } from '@nestjs/common';
import { Redis, Cluster } from 'ioredis';

const nonClusteredRedisFactory: FactoryProvider['useFactory'] = () => {
  const client = new Redis({
    port: Config.REDIS_PORT,
    host: Config.REDIS_HOST,
    tls: {},
    lazyConnect: true,
  });

  client.on('connect', () => {
    console.log('Redis connected');
  });
  client.on('error', (err) => {
    console.log('Redis error', err);
  });

  return client;
};

// const clusteredRedisFactory: FactoryProvider['useFactory'] = () => {
//   const cluster = new Cluster(
//     [
//       {
//         port: Config.REDIS_PORT,
//         host: Config.REDIS_HOST,
//       },
//     ],
//     {
//       scaleReads: 'slave',
//       dnsLookup: (address, callback) => callback(null, address),
//       slotsRefreshTimeout: 2000,
//       redisOptions: {
//         tls: {},
//         lazyConnect: true,
//       },
//     }
//   );

//   cluster.on('connect', () => {
//     console.log('Redis connected');
//   });
//   cluster.on('error', (err) => {
//     console.log('Redis error', err);
//   });

//   return cluster;
// };

const redisProvider: Provider = {
  provide: Redis,
  useFactory: nonClusteredRedisFactory,
};

@Module({
  imports: [],
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
