import { LOGPATH, NODE_ENV, LOG_FILE_NAME, APP_NAME } from "../lib/constants";
import { transports, format, createLogger } from "winston";
import { mkdirSync, existsSync } from "fs";
import safeStringify from "fast-safe-stringify";
import { isValidObject } from "../utils/common";

const { printf, combine, timestamp, label } = format;

class Logger {
  #logger = null;
  constructor(params) {
    Object.keys(params).map((x) => (this[x] = params[x]));
  }

  // Creats Log directory if it doesnt exist
  createLogDirectory() {
    try {
      if (!existsSync(this.LOGPATH)) mkdirSync(this.LOGPATH);
    } catch (error) {
      console.log("Error while creating Log Directory -> ", error);
    }
  }

  // Our Custom Format of Logging
  logCustomFormat() {
    return printf(({ level, message, label, timestamp, stack, ...info }) => {
      const logContent = { timestamp, label, message };
      if (isValidObject(info)) logContent.info = info;
      if (level === "error") {
        if (stack) logContent.stack = stack;
      }
      return safeStringify(logContent);
    });
  }

  // Enable logging in console on Development
  addConsoleTransports() {
    if (NODE_ENV === "development") {
      this.#logger.add(
        new transports.Console({
          format: combine(
            label({ label: APP_NAME }),
            timestamp(),
            this.logCustomFormat()
          ),
        })
      );
    }
  }

  // Initialize Logger
  initLogger() {
    this.createLogDirectory();
    this.#logger = createLogger({
      format: combine(
        label({ label: this.APP_NAME }),
        timestamp(),
        this.logCustomFormat()
      ),
      transports: [new transports.File({ filename: this.LOG_FILE_NAME })],
    });
    this.addConsoleTransports();
  }

  // Returns Logger Object
  getLogger() {
    this.initLogger();
    return this.#logger;
  }
}

export default new Logger({ APP_NAME, LOG_FILE_NAME, LOGPATH }).getLogger();
