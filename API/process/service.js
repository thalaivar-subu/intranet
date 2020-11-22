import logger from "../../utils/logger";
import { addEdge, addNode, adjacencyList, depthFirstSearch } from "./model";

const CreateDevice = async ({ type, name }, res) => {
  logger.info("Create Device Params -> ", { type, name });
  try {
    if (adjacencyList.has(name)) {
      res.status(400).json({ msg: `Device '${name}' already exists` });
      return;
    } else {
      addNode(name);
      res.status(200).json({ msg: `Successfully added ${name}` });
      return;
    }
  } catch (error) {
    logger.error("Error while creating device", error);
    res.status(500);
    return;
  }
};

const CreateConnection = async ({ source, targets }, res) => {
  logger.info("Create Connection Params -> ", { source, targets });
  try {
    if (!adjacencyList.has(source)) {
      res.status(400).json({ msg: `Node '${source}' not found` });
      return;
    }
    targets.map((x) => {
      if (!adjacencyList.has(x)) {
        res.status(400).json({ msg: `Target '${x}' not found` });
        return;
      }
      if (adjacencyList.get(source).includes(x)) {
        res.status(400).json({ msg: "Devices are already connected" });
        return;
      }
      if (x === source) {
        res.status(400).json({ msg: "Cannot connect device to itself" });
        return;
      }
    });
    targets.map((x) => {
      addEdge(source, x);
    });
    res.status(200).json({ msg: "Successfully connected" });
    return;
  } catch (error) {
    logger.error("Error while creating Connection", error);
    res.status(500);
    return;
  }
};

const FetchRouteInfo = async (requestRoute, res) => {
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
      res.status(400).json({ msg: `Node '${from}' not found` });
      return;
    }
    if (!adjacencyList.has(to)) {
      res.status(400).json({ msg: `Node '${to}' not found` });
      return;
    }
    if (from.startsWith("R") || to.startsWith("R")) {
      res.status(400).json({ msg: "Route cannot be calculated with repeater" });
      return;
    }
    const { visited = [], nodeToFind = "" } = depthFirstSearch(from, to) || {};
    if (nodeToFind) {
      res.status(200).json({ msg: `Route is ${visited.join("->")}` });
      return;
    }
    res.status(404).json({ msg: "Route not found" });
    return;
  } catch (error) {
    logger.error("Error while fetching route info", error);
    res.status(500);
    return;
  }
};

export { CreateDevice, CreateConnection, FetchRouteInfo };
