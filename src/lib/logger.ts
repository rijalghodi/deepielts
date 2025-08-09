import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

const logger = pino({
  transport: isDev
    ? {
        target: "pino-pretty",
        options: { colorize: true, singleLine: false, translateTime: "SYS:standard" },
      }
    : undefined,
  serializers: {
    err: (e) => e, // full error objects
  },
});

export default logger;
