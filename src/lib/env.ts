import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    // App Configuration
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_API_BASE_URL: z.string(),

    // Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

    // Sentry Configuration
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

    // Paddle Configuration
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: z.string(),
    NEXT_PUBLIC_PADDLE_PRO_MONTH_CHECKOUT_URL: z.string(),
    NEXT_PUBLIC_PADDLE_PRO_MONTH_PRICE_ID: z.string(),
    NEXT_PUBLIC_PADDLE_PRO_QUARTER_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_PADDLE_ENV: z.enum(["sandbox", "production"]).optional(),
  },
  runtimeEnv: {
    // App Configuration
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,

    // Firebase Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,

    // Sentry Configuration
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Paddle Configuration
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
    NEXT_PUBLIC_PADDLE_PRO_MONTH_CHECKOUT_URL: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTH_CHECKOUT_URL,
    NEXT_PUBLIC_PADDLE_PRO_MONTH_PRICE_ID: process.env.NEXT_PUBLIC_PADDLE_PRO_MONTH_PRICE_ID,
    NEXT_PUBLIC_PADDLE_PRO_QUARTER_PRICE_ID: process.env.NEXT_PUBLIC_PADDLE_PRO_QUARTER_PRICE_ID,
    NEXT_PUBLIC_PADDLE_ENV: process.env.NEXT_PUBLIC_PADDLE_ENV ?? "sandbox",
  },
});

export const serverEnv = createEnv({
  server: {
    // App Configuration
    ALLOWED_ORIGIN_CORS: z.string().optional(),

    // Firebase Configuration
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string(),

    // JWT Configuration
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string().optional(),
    JWT_REFRESH_EXPIRES_IN: z.string().optional(),

    // Resend Configuration
    RESEND_API_KEY: z.string(),

    // Open AI Configuration
    OPENAI_API_KEY: z.string(),

    // Sentry Configuration
    SENTRY_DSN: z.string().optional(),
    SENTRY_ENVIRONMENT: z.string().optional(),
    SENTRY_ORG: z.string().optional(),
    SENTRY_PROJECT: z.string().optional(),
    SENTRY_AUTH_TOKEN: z.string().optional(),

    // Redis Configuration
    REDIS_URL: z.string(),

    // Paddle Configuration
    PADDLE_API_KEY: z.string(),
    PADDLE_WEBHOOK_SECRET: z.string(),
  },
  runtimeEnv: {
    // App Configuration
    ALLOWED_ORIGIN_CORS: process.env.ALLOWED_ORIGIN_CORS,

    // Firebase Configuration
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY,

    // JWT Configuration
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "1h",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "60d",

    // Resend Configuration
    RESEND_API_KEY: process.env.RESEND_API_KEY,

    // Open AI Configuration
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // Sentry Configuration
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT ?? "local",
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,

    // Redis Configuration
    REDIS_URL: process.env.REDIS_URL,

    // Paddle Configuration
    PADDLE_API_KEY: process.env.PADDLE_API_KEY,
    PADDLE_WEBHOOK_SECRET: process.env.PADDLE_WEBHOOK_SECRET,
  },
});

export const env = { ...clientEnv, ...serverEnv };
