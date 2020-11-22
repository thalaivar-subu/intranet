import logger from "../../utils/logger";
import { addEdge, addNode, adjacencyList } from "./model";

const CreateDevice = async ({ type, name }, res) => {
  logger.info("Create Device Params -> ", { type, name });
  try {
    if (adjacencyList.has(name)) {
      res.status(400).json({ msg: `Device '${name}' already exists` });
    } else {
      addNode(name);
      res.status(200).json({ msg: `Successfully added ${name}` });
    }
  } catch (error) {
    logger.error("Error while creating device");
    res.status(500).json({ msg: `Internal Server Error` });
  }
};

const CreateConnection = async ({ source, targets }, res) => {
  logger.info("Create Connection Params -> ", { source, targets });
  try {
    if (!adjacencyList.has(source)) {
      res.status(400).json({ msg: `Node '${source}' not found` });
    }
    targets.map((x) => {
      if (!adjacencyList.has(x)) {
        res.status(400).json({ msg: `Target '${x}' not found` });
      }
      if (adjacencyList.get(source).includes(x)) {
        res.status(400).json({ msg: `Device '${x}' are already connected` });
      }
    });
    targets.map((x) => {
      addEdge(source, x);
    });
    res.status(200).json({ msg: "Successfully connected" });
  } catch (error) {
    logger.error("Error while creating Connection", error);
    res.status(500).json({ msg: `Internal Server Error` });
  }
};

export { CreateDevice, CreateConnection };
