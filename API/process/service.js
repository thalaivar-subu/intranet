import { isValidObject } from "../../utils/common";
import logger from "../../utils/logger";
import { addEdge, addNode, adjacencyList, getRoute } from "./model";

const CreateDevice = ({ type, name }) => {
  let response = {};
  try {
    if (adjacencyList.has(name)) {
      response = {
        status: 400,
        msg: `Device '${name}' already exists`,
      };
    } else {
      addNode(name);
      response = {
        status: 200,
        msg: `Successfully added ${name}`,
      };
    }
  } catch (error) {
    logger.error("Error while creating device", error);
    response = {
      status: 500,
      msg: "Internal Server Error",
    };
  }
  return response;
};

const CreateConnection = ({ source, targets }) => {
  let response = {};
  try {
    if (!adjacencyList.has(source)) {
      response = {
        status: 400,
        msg: `Node '${source}' not found`,
      };
    } else {
      targets.map((x) => {
        if (!adjacencyList.has(x)) {
          response = {
            status: 400,
            msg: `Target '${x}' not found`,
          };
        }
        if (adjacencyList.get(source).includes(x)) {
          response = {
            status: 400,
            msg: "Devices are already connected",
          };
        }
        if (x === source) {
          response = {
            status: 400,
            msg: "Cannot connect device to itself",
          };
        }
      });
      targets.map((x) => {
        addEdge(source, x);
      });
    }
    if (!isValidObject(response)) {
      response = {
        status: 200,
        msg: "Successfully connected",
      };
    }
  } catch (error) {
    logger.error("Error while creating Connection", error);
    response = {
      status: 500,
      msg: "Internal Server Error",
    };
  }
  return response;
};

const FetchRouteInfo = (requestRoute) => {
  let response = {};
  try {
    const queryString = requestRoute.replace("/info-routes?", "");
    const queryParams = queryString.split("&");
    const queryParamMap = {};
    queryParams.map((x) => {
      const [key, value] = x.split("=");
      queryParamMap[key] = value;
    });
    const { from, to } = queryParamMap;
    if (!adjacencyList.has(from)) {
      response = {
        status: 400,
        msg: `Node '${from}' not found`,
      };
    } else if (!adjacencyList.has(to)) {
      response = {
        status: 400,
        msg: `Node '${to}' not found`,
      };
    } else if (from.startsWith("R") || to.startsWith("R")) {
      response = {
        status: 200,
        msg: "Route cannot be calculated with repeater",
      };
    } else {
      const Route = getRoute(from, to);
      logger.info({ Route, from, to, msg: `Route is ${Route}` });
      if (Route) {
        response = {
          status: 200,
          msg: `Route is ${Route}`,
        };
      } else {
        response = {
          status: 404,
          msg: "Route not found",
        };
      }
    }
  } catch (error) {
    logger.error("Error while fetching route info", error);
    response = { status: 500, msg: "Internal Server Error" };
  }
  logger.info({ response });
  return response;
};

export { CreateDevice, CreateConnection, FetchRouteInfo };
