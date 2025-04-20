import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const redis = new Redis(process.env.REDIS, { tls: {} });

await redis.set("foo", "bar");
