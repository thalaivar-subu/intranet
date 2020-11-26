import { isValidObject } from "../../utils/common";
import logger from "../../utils/logger";
import Graph from "./model";

const CreateDevice = ({ type, name }) => {
  let response = {};
  try {
    if (Graph.adjacencyList().has(name)) {
      response = {
        status: 400,
        msg: `Device '${name}' already exists`,
      };
    } else {
      Graph.addNode(name, type);
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
    if (!Graph.adjacencyList().has(source)) {
      response = {
        status: 400,
        msg: `Node '${source}' not found`,
      };
    } else {
      for (let x of targets) {
        if (!Graph.adjacencyList().has(x)) {
          response = {
            status: 400,
            msg: `Target '${x}' not found`,
          };
          break;
        } else if (Graph.adjacencyList().get(source).includes(x)) {
          response = {
            status: 400,
            msg: "Devices are already connected",
          };
          break;
        } else if (x === source) {
          response = {
            status: 400,
            msg: "Cannot connect device to itself",
          };
          break;
        }
      }
      if (!isValidObject(response)) {
        targets.map((x) => Graph.addEdge(source, x));
        response = {
          status: 200,
          msg: "Successfully connected",
        };
      }
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
    const hasFrom = Graph.adjacencyList().has(from);
    const hasTo = Graph.adjacencyList().has(to);
    if (!hasFrom || !hasTo) {
      response = {
        status: 400,
        msg: `Node '${!hasFrom ? from : to}' not found`,
      };
    } else if (
      [Graph.getNodeInfo(from).type, Graph.getNodeInfo(to).type].includes(
        "REPEATER"
      )
    ) {
      response = {
        status: 400,
        msg: "Route cannot be calculated with repeater",
      };
    } else {
      const Route = Graph.getPath(from, to);
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
  return response;
};

const ModifyDeviceStrength = (requestRoute, { value }) => {
  let response = {};
  try {
    const paramString = requestRoute.replace("/devices/", "");
    const [nodeToModify] = paramString.split("/");
    Graph.modifyStrength(nodeToModify, parseInt(value));
    response = {
      status: 200,
      msg: "Successfully defined strength",
    };
  } catch (error) {
    logger.error("Error while modifying strength -> ", error);
    response = { status: 500, msg: "Internal Server Error" };
  }
  return response;
};

export { CreateDevice, CreateConnection, FetchRouteInfo, ModifyDeviceStrength };
