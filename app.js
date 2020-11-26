// eslint-disable-next-line no-unused-vars
import logEventErrors from "./utils/eventerrors";
import express from "express";
import morgan from "morgan";
import logger from "./utils/logger";
import { APP_NAME, PORT } from "./lib/constants";
import ProcessController from "./API/process/controller";
import bodyParser from "./utils/bodyparser";

class App {
  #app = null;
  constructor(params) {
    Object.keys(params).map((x) => (this[x] = params[x]));
  }
  initApp() {
    this.app = express();
    this.addMiddlewares();
    this.addHealtCheck();
    this.addRoutes()
    this.app.listen(PORT, () => {
      logger.info(
        `${this.APP_NAME} app listening at http://localhost:${this.PORT}`
      );
    });
  }
  addMiddlewares() {
    this.app.use(
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
    this.app.use(bodyParser);
  }
  addHealtCheck() {
    this.app.get("/", (req, res) => {
      res.status(200).json({ message: "I am Alive" });
    });
  }
  addRoutes() {
    this.app.post("/ajiranet/process", ProcessController);
  }
  getApp() {
    this.initApp();
    return this.app;
  }
}

new App({ APP_NAME, PORT }).getApp();
