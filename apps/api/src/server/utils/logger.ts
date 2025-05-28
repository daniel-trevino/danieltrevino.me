import { PinoLogger } from "@mastra/loggers";

export const logger = new PinoLogger({
  name: "Mastra",
  level: process.env.NODE_ENV === "production" ? "info" : "info",
});
