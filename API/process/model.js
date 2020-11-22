const adjacencyList = new Map();
const visited = new Set();
const addNode = (v) => {
  adjacencyList.set(v, []);
};
const addEdge = (from, to) => {
  if (!adjacencyList.get(from).includes(to)) adjacencyList.get(from).push(to);
  if (!adjacencyList.get(to).includes(from)) adjacencyList.get(to).push(from);
};
const removeNode = (v) => {
  // deleting node from list
  adjacencyList.delete(v);

  // Remove Edges of the node
  for (let [key, value] of adjacencyList.entries()) {
    const index = value.indexOf(v);
    if (index >= 0) {
      const splicedValue = value.filter((x) => x !== v);
      adjacencyList.set(key, splicedValue);
    }
  }
};
const depthFirstSearch = (start, nodeToFind) => {
  visited.add(start);
  if (start === nodeToFind) {
    return { nodeToFind, visited };
  }
  const destinations = adjacencyList.get(start);
  for (const destination of destinations) {
    if (destination === nodeToFind) {
      return { nodeToFind, visited };
    }
    if (!visited.has(destination)) {
      depthFirstSearch(destination, nodeToFind);
    }
  }
};

export { adjacencyList, addNode, addEdge, removeNode, depthFirstSearch };
