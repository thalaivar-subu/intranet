import { isValidObject } from "../../utils/common";
import logger from "../../utils/logger";

const ALLOWED_METHODS = ["CREATE", "FETCH", "MODIFY"];
const ALLOWED_ROUTES = ["/connections", "/devices", "/info-routes"];
const ALLOWED_CONTENT_TYPES = ["application/json"];
const ALLOWED_DEVICE_TYPES = ["COMPUTER", "REPEATER"];

const ProcessRequestValidator = ({
  requestMethod,
  requestRoute,
  contentInfo,
  requestData,
}) => {
  let validationResult = { isValid: true };
  try {
    const contentType = contentInfo ? contentInfo.split(" : ")[1] : "";
    if (
      !ALLOWED_METHODS.find((x) => x === requestMethod) ||
      !ALLOWED_ROUTES.find((x) => x.startsWith(requestRoute)) ||
      !ALLOWED_CONTENT_TYPES.find((x) => x.startsWith(contentType))
    ) {
      validationResult = {
        isValid: false,
        status: 400,
        message: `Invalid Command`,
      };
    }
    if (requestMethod === "CREATE" && requestRoute === "/devices") {
      if (
        !isValidObject(requestData) ||
        !(
          requestData.type &&
          ALLOWED_DEVICE_TYPES.find((x) => requestData.type === x)
        ) ||
        !requestData.name
      ) {
        validationResult = {
          isValid: false,
          status: 400,
          message: "Invalid Command.",
        };
      }
    }
    return validationResult;
  } catch (error) {
    logger.error("Error in ProcessValidator -> ", error);
  }
};
export default ProcessRequestValidator;
