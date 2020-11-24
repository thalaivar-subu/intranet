import { isValidArray } from "../../utils/common";
import logger from "../../utils/logger";

const adjacencyList = new Map();
const strengtList = new Map();

const addNode = (v) => {
  adjacencyList.set(v, []);
  strengtList.set(v, 5);
};

const addEdge = (from, to) => {
  if (!adjacencyList.get(from).includes(to)) adjacencyList.get(from).push(to);
  if (!adjacencyList.get(to).includes(from)) adjacencyList.get(to).push(from);
};

const modifyStrength = (node, strength) => strengtList.set(node, strength);

const depthFirstSearch = (start, nodeToFind, visited = new Set()) => {
  visited.add(start);
  const destinations = adjacencyList.get(start);
  for (const destination of destinations) {
    if (destination === nodeToFind) {
      visited.add(nodeToFind);
      return { nodeToFind, visited };
    }
    if (!visited.has(destination)) {
      const isFound = depthFirstSearch(destination, nodeToFind, visited);
      if (isFound) return isFound;
    }
  }
  return {};
};

const findAllPosibleRoutes = (start, end) => {
  const possibleCombinations = [];
  const connections = adjacencyList.get(start);
  if (start === end || connections.includes(end)) {
    return [[start, end]];
  }
  const visited = new Set();
  visited.add(start);
  for (let i = 0; i < connections.length; i++) {
    const result = depthFirstSearch(connections[i], end, visited);
    if (result.nodeToFind) {
      const visitedArrray = Array.from(visited);
      possibleCombinations.push(visitedArrray);
    }
  }
  return possibleCombinations;
};
const getRoute = (start, end) => {
  let result = "";
  try {
    let routes = findAllPosibleRoutes(start, end);
    if (isValidArray(routes)) {
      let min = routes[0];
      for (let i = 1; i < routes.length; i++) {
        if (routes[i].length < min.length) {
          min = routes[i];
        }
      }
      result = min.join("->");
    }
  } catch (error) {
    logger.error("Error while gettig routes -> ", error);
  }
  return result;
};

export {
  adjacencyList,
  strengtList,
  addNode,
  addEdge,
  depthFirstSearch,
  findAllPosibleRoutes,
  getRoute,
  modifyStrength,
};
