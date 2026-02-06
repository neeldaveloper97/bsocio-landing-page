
import { Module, Global, Provider } from '@nestjs/common';
import Redis from 'ioredis';

const redisProvider: Provider = {
    provide: 'REDIS_CLIENT',
    useFactory: () => {
        return new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            username: process.env.REDIS_USERNAME || undefined,
        });
    },
};

@Global()
@Module({
    providers: [redisProvider],
    exports: [redisProvider],
})
export class RedisModule { }
