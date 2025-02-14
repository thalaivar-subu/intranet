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
export const APP_PORT = 8080;
export const TEST_PORT = 8081;
export const TEST_URL = `http://127.0.0.1:${TEST_PORT}`;
export const PORT = NODE_ENV === "test" ? TEST_PORT : APP_PORT;
export const ALLOWED_METHODS = ["CREATE", "FETCH", "MODIFY"];
export const ALLOWED_ROUTES = ["/connections", "/devices", "/info-routes"];
export const ALLOWED_CONTENT_TYPES = [
  "application/json",
  "application/x-www-form-urlencoded",
];
export const ALLOWED_DEVICE_TYPES = ["COMPUTER", "REPEATER"];
