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

export const googleLoginRateLimit =
  new Ratelimit({
    redis,

    limiter:
      Ratelimit.slidingWindow(
        10,
        "15 m"
      ),

    prefix:
      "ironage:rate-limit:google-login",
  });



export const emailVerificationResendRateLimit =
  new Ratelimit({
    redis,

    limiter:
      Ratelimit.slidingWindow(
        3,
        "15 m"
      ),

    prefix:
      "ironage:rate-limit:email-verification-resend",
  });
