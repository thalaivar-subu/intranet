// eslint-disable-next-line no-unused-vars
import logEventErrors from "./utils/eventerrors";
import express from "express";
import morgan from "morgan";
import logger from "./utils/logger";
import { APP_NAME, PORT } from "./lib/constants";
import Routes from "./API/routes";
import bodyParser from "./utils/bodyparser";

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

app.use(bodyParser);

// Healtcheck End point
app.get("/", (req, res) => {
  res.status(200).json({ message: "I am Alive" });
});

Routes(app);

// App Listens
app.listen(PORT, () => {
  logger.info(`${APP_NAME} app listening at http://localhost:${PORT}`);
});
