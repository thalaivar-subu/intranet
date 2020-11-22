// eslint-disable-next-line no-unused-vars
import logEventErrors from "./utils/eventerrors";
import express from "express";
import morgan from "morgan";
import { parseJson } from "./utils/common";
import uniqid from "uniqid";
import { middleware, set } from "express-http-context";
import logger from "./utils/logger";
import { APP_NAME, PORT, NODE_ENV } from "./lib/constants";

const app = express();

// Logs Request Info
app.use(
  morgan((tokens, req, res) => {
    logger.info(
      [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens["response-time"](req, res),
        "ms",
      ].join(" ")
    );
  })
);

// Body Parsers
app.use(express.urlencoded({ limit: "256kb", extended: true }));
app.use(express.json({ limit: "256kb" }));
app.use(middleware);

// Sets Uniqid in context
app.use((req, res, next) => {
  const { headers: { context } = {}, body } = req;
  const { uniqId = uniqid() } = parseJson(context);
  set("reqId", uniqId);
  set("requestBody", body);
  next();
});

// Healtcheck End point
app.get("/", (req, res) => {
  res.status(200).send({ message: "I am Alive" });
});

// App Listens
app.listen(PORT, () => {
  logger.info(`${APP_NAME} app listening at http://localhost:${PORT}`);
});
