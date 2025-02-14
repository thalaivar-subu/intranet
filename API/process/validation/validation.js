import logger from "../../../utils/logger";
import validateCreate from "./create";
import validateFetch from "./fetch";
import validateModify from "./modify";
import {
  ALLOWED_METHODS,
  ALLOWED_ROUTES,
  ALLOWED_CONTENT_TYPES,
} from "../../../lib/constants";

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
      !(
        ALLOWED_METHODS.find((x) => x === requestMethod) &&
        ALLOWED_ROUTES.find((x) => x.startsWith(requestRoute)) &&
        ALLOWED_CONTENT_TYPES.find((x) => x.startsWith(contentType))
      )
    ) {
      validationResult = {
        isValid: false,
        status: 400,
        message: `Invalid Command`,
      };
    }
    switch (requestMethod) {
      case "CREATE":
        return validateCreate(requestRoute, requestData);
      case "FETCH":
        return validateFetch(requestRoute, requestData);
      case "MODIFY":
        return validateModify(requestRoute, requestData);
    }
    return validationResult;
  } catch (error) {
    logger.error("Error in ProcessValidator -> ", error);
  }
};
export default ProcessRequestValidator;
