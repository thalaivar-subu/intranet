import { isValidArray } from "../../../utils/common";
import Graph from "../model";

const validateModify = (requestRoute, requestData) => {
  let validationResult = { isValid: true };
  if (requestRoute.includes("/firewall")) {
    const { devices } = requestData;
    if (!isValidArray(devices)) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "value should be an array",
      };
    }
    const paramString = requestRoute.replace("/firewall/", "");
    const [nodeToModify] = paramString.split("/");
    if (devices.find((x) => !Graph.adjacencyList().has(x))) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "All the devices are not valid",
      };
    }
    if (Graph.adjacencyList().has(nodeToModify)) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "Node to Modify firewall is not present",
      };
    }
  } else if (requestRoute.startsWith("/devices")) {
    const { value } = requestData;
    const paramString = requestRoute.replace("/devices/", "");
    const [nodeToModify] = paramString.split("/");
    if (!Graph.adjacencyList().has(nodeToModify)) {
      validationResult = {
        isValid: false,
        status: 404,
        message: "Device Not Found",
      };
    } else if (!Number.isInteger(value)) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "value should be an integer",
      };
    }
  }
  return validationResult;
};

export default validateModify;
