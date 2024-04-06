"use server"
import config from '@/config';
import { Ratelimit } from '@upstash/ratelimit';
import {Redis} from 'ioredis'



export const redisClient = new Redis({
    host: config.redis.host!, 
    port: config.redis.port!, 
    password: config.redis.password!, 
});

export const rateLimitInstance = async (requests: number, time: any) => {
  return new Ratelimit({
    redis: redisClient as any,
    limiter: Ratelimit.slidingWindow(requests, time)
  })
}


