import { isValidObject, isValidArray } from "../../../utils/common";
const ALLOWED_DEVICE_TYPES = ["COMPUTER", "REPEATER"];

const validateCreate = (requestRoute, requestData) => {
  let validationResult = { isValid: true };
  if (requestRoute === "/devices") {
    if (!(isValidObject(requestData) && requestData.name)) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "Invalid Command.",
      };
    }
    if (
      !(requestData.type && ALLOWED_DEVICE_TYPES.includes(requestData.type))
    ) {
      validationResult = {
        isValid: false,
        status: 400,
        message: `type '${requestData.type}' is not supported`,
      };
    }
  }
  if (requestRoute === "/connections") {
    if (
      !(
        isValidObject(requestData) &&
        requestData.source &&
        isValidArray(requestData.targets)
      )
    ) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "Invalid command syntax",
      };
    }
  }
  return validationResult;
};

export default validateCreate;
