import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {

    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async saveRedis(key: string, value: any, expiryTime = 60) {

        await this.redis.set(key, JSON.stringify(value), 'EX', expiryTime);

    }

    async getFromRedis(key: string) {

        const data = await this.redis.get(key);

        return JSON.parse(data);

    }

}
