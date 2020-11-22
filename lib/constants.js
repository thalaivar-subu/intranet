export const APP_NAME = process.env.APP_NAME || "intranet";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const LOGPATH = process.env.LOGPATH || "logs";
export const LOG_FILE_NAME = `${LOGPATH}/${
  APP_NAME +
  new Date().getFullYear() +
  "-" +
  (new Date().getMonth() + 1) +
  "-" +
  new Date().getDate()
}.log`;
export const PORT = 3000;
