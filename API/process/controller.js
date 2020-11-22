import { isValidArray, parseJson } from "../../utils/common";
import logger from "../../utils/logger";
import ProcessRequestValidator from "./validator/validater";
import { CreateDevice, CreateConnection } from "./service";
import { adjacencyList } from "./model";

const ProcessController = async (req, res) => {
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
    if (!isValid) return { status, message };
    if (requestMethod === "CREATE") {
      if (requestRoute === "/devices") {
        return CreateDevice(requestData, res);
      }
      if (requestRoute === "/connections") {
        return CreateConnection(requestData, res);
      }
    }
    if (requestMethod === "FETCH") {
      if (requestRoute === "/devices") {
        return res.status(200).json({
          devices: Array.from(adjacencyList.keys(), (x) => ({
            name: x,
            type: x.startsWith("R") ? "REPEATER" : "COMPUTER",
          })),
        });
      }
    }
  } catch (error) {
    logger.error("Error in Process Controller -> ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export default ProcessController;
