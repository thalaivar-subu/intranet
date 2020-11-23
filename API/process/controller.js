import { parseJson } from "../../utils/common";
import logger from "../../utils/logger";
import ProcessRequestValidator from "./validator/validater";
import { CreateDevice, CreateConnection, FetchRouteInfo } from "./service";
import { adjacencyList } from "./model";

const ProcessController = async (req, res) => {
  let response = {};
  try {
    const requestParams = req.body ? req.body.split("\n") : [];
    const [
      requestInfo = "",
      contentInfo = "",
      requestDataInfo = "",
    ] = requestParams;
    const [requestMethod, requestRoute] = requestInfo.split(" ");
    const requestData = parseJson(requestDataInfo);
    // Request Validation
    const { isValid, status, message } = ProcessRequestValidator({
      contentInfo,
      requestMethod,
      requestRoute,
      requestData,
    });
    if (!isValid) {
      response = {
        status,
        msg: message,
      };
    } else {
      if (requestMethod === "CREATE") {
        if (requestRoute === "/devices") {
          response = CreateDevice(requestData);
        }
        if (requestRoute === "/connections") {
          response = CreateConnection(requestData);
        }
      }
      if (requestMethod === "FETCH") {
        if (requestRoute === "/devices") {
          response = {
            status: 200,
            devices: Array.from(adjacencyList.keys(), (x) => ({
              name: x,
              type: x.startsWith("R") ? "REPEATER" : "COMPUTER",
            })),
          };
        }
        if (requestRoute.startsWith("/info-routes")) {
          response = FetchRouteInfo(requestRoute);
        }
      }
    }
  } catch (error) {
    logger.error("Error in Process Controller -> ", error);
    response = {
      status: 500,
      msg: "Internal Server Error",
    };
  }
  if (response.msg) res.status(response.status).json({ msg: response.msg });
  else if (response.devices) {
    res.status(response.status).json({ devices: response.devices });
  }
};

export default ProcessController;
