class Graph {
  constructor() {
    this.adjacencyList = new Map();
    this.nodeInfo = new Map();
    this.visited = new Set();
    this.isFound = false;
  }
  addNode(v, type) {
    this.adjacencyList.set(v, []);
    this.nodeInfo.set(v, { strength: 5, type });
  }
  addEdge(from, to) {
    if (!this.adjacencyList.get(from).includes(to))
      this.adjacencyList.get(from).push(to);
    if (!this.adjacencyList.get(to).includes(from))
      this.adjacencyList.get(to).push(from);
  }
  modifyStrength(node, strength) {
    const nodeInfo = this.nodeInfo.get(node);
    nodeInfo.strength = strength;
    this.nodeInfo.set(node, nodeInfo);
  }
  clearVisited() {
    this.visited = new Set();
    this.isFound = false;
  }
  depthFirstSearch(start, nodeToFind, strength) {
    if (strength <= 0) return;
    this.visited.add(start);
    const destinations = this.adjacencyList.get(start);
    if (destinations.includes(nodeToFind)) {
      this.visited.add(nodeToFind);
      this.isFound = true;
      return;
    }
    for (let destination of destinations) {
      if (!this.visited.has(destination)) {
        const { type } = this.nodeInfo.get(destination);
        const modifiedStrength =
          type === "REPEATER" ? 2 * strength : strength - 1;
        this.depthFirstSearch(destination, nodeToFind, modifiedStrength);
        if (this.isFound) return;
      }
    }
    this.visited.delete(start);
  }
  getPath(start, nodeToFind) {
    this.clearVisited();
    if (start === nodeToFind) return `${start}->${nodeToFind}`;
    const { strength } = this.nodeInfo.get(start);
    this.depthFirstSearch(start, nodeToFind, strength);
    return this.visited.size > 0 ? Array.from(this.visited).join("->") : "";
  }
}

const graph = new Graph();

export default graph;
