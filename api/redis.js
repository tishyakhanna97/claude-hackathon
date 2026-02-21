import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // increment a simple hit counter
  const count = await redis.incr('hit_count');
  res.status(200).json({ ping: 'pong', hit_count: count });
}
