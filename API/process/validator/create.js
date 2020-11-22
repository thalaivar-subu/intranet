import { isValidObject, isValidArray } from "../../../utils/common";
const ALLOWED_DEVICE_TYPES = ["COMPUTER", "REPEATER"];

const validateCreate = (requestRoute, requestData) => {
  let validationResult = { isValid: true };
  if (requestRoute === "/devices") {
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
        message: "Invalid Command Syntax.",
      };
    }
  }
  return validationResult;
};

export default validateCreate;
