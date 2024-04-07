"use server"
import config from '@/config';
import { Ratelimit } from '@upstash/ratelimit';
import {Redis} from 'ioredis'



export const redisClient = async  () => new Redis({
    host: config.redis.host!, 
    port: config.redis.port!, 
    password: config.redis.password!, 
});

export const rateLimitInstance = async (requests: number, time: any) => {
  const redis = await redisClient()
  console.log(redis, "redis")
  return new Ratelimit({
    redis: redis as any,
    limiter: Ratelimit.slidingWindow(requests, time)
  })
}


