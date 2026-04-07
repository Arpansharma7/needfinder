import { redis } from "@/lib/redis";

if (redis) {
  await redis.get("test");
}
