import Graph from "../model";

const validateModify = (requestRoute, requestData) => {
  let validationResult = { isValid: true };
  if (requestRoute.startsWith("/devices")) {
    const { value } = requestData;
    const paramString = requestRoute.replace("/devices/", "");
    const [nodeToModify] = paramString.split("/");
    if (!Graph.adjacencyList.has(nodeToModify)) {
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
