import { isValidArray, parseJson } from "../../utils/common";
import logger from "../../utils/logger";
import ProcessRequestValidator from "./validater";
import { Create } from "./service";

const ProcessController = async (req, res) => {
  try {
    const requestKeys = Object.keys(req.body);
    const requestParams = isValidArray(requestKeys)
      ? requestKeys[0].split("\n")
      : [];
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
    if (requestMethod === "CREATE") return Create(requestData, res);
  } catch (error) {
    logger.error("Error in Process Controller -> ", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export default ProcessController;
