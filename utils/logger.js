import { LOGPATH, NODE_ENV, LOG_FILE_NAME, APP_NAME } from "../lib/constants";
import { transports, format, createLogger } from "winston";
import { mkdirSync, existsSync } from "fs";
import safeStringify from "fast-safe-stringify";
import { isValidObject } from "../utils/common";

const { printf, combine, timestamp, label } = format;

// Our Custom Format of Logging
const logCustomFormat = printf(
  ({ level, message, label, timestamp, stack, ...info }) => {
    const logContent = { timestamp, label, message };
    if (isValidObject(info)) logContent.info = info;
    if (level === "error") {
      if (stack) logContent.stack = stack;
    }
    return safeStringify(logContent);
  }
);

// Creating Log Directory
(() => {
  try {
    if (!existsSync(LOGPATH)) mkdirSync(LOGPATH);
  } catch (error) {
    console.log("Error while creating Log Directory -> ", error);
  }
})();

// Creating Logger
const logger = createLogger({
  format: combine(label({ label: APP_NAME }), timestamp(), logCustomFormat),
  transports: [new transports.File({ filename: LOG_FILE_NAME })],
});

// Enable logging in console on Development
if (NODE_ENV === "development") {
  logger.add(
    new transports.Console({
      format: combine(label({ label: APP_NAME }), timestamp(), logCustomFormat),
    })
  );
}

export default logger;
