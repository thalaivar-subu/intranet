const validateFetch = (requestRoute) => {
  let validationResult = { isValid: true };
  if (requestRoute.startsWith("/info-routes")) {
    const queryString = requestRoute.replace("/info-routes?", "");
    const queryParams = queryString.split("&");
    const queryParamMap = {};
    queryParams.map((x) => {
      const [key, value] = x.split("=");
      queryParamMap[key] = value;
    });
    if (
      !(
        queryParams.length === 2 &&
        Object.keys(queryParamMap).filter((x) => x === "from" || x === "to")
          .length === 2
      )
    ) {
      validationResult = {
        isValid: false,
        status: 400,
        message: "Invalid Request",
      };
    }
  }
  return validationResult;
};

export default validateFetch;
