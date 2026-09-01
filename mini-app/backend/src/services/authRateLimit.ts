import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis =
  Redis.fromEnv();

export const emailRegisterRateLimit =
  new Ratelimit({
    redis,

    limiter:
      Ratelimit.slidingWindow(
        5,
        "15 m"
      ),

    prefix:
      "ironage:rate-limit:register",
  });

export const emailLoginRateLimit =
  new Ratelimit({
    redis,

    limiter:
      Ratelimit.slidingWindow(
        10,
        "15 m"
      ),

    prefix:
      "ironage:rate-limit:login",
  });
