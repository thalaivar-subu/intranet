const bodyParser = (req, res, next) => {
  req.setEncoding("utf8");
  let requestBody = "";
  req.on("data", function (chunk) {
    requestBody += chunk;
  });
  req.on("end", function () {
    req.body = requestBody;
    next();
  });
};
export default bodyParser;
