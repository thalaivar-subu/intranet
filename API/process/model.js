class Graph {
  static #adjacencyList = new Map();
  static #visited = new Set();
  static #isFound = false;
  static #nodeInfo = new Map();
  static addNode(v, type) {
    this.#adjacencyList.set(v, []);
    this.setNodeInfo(v, { strength: 5, type, fireWall: [] });
  }
  static addEdge(from, to) {
    this.#adjacencyList.get(from).push(to);
    this.#adjacencyList.get(to).push(from);
  }
  static modifyNode({ node, strength, fireWall }) {
    const {
      type,
      strength: existingStrength,
      fireWall: existingFireWall = [],
    } = this.getNodeInfo(node);
    strength = strength || existingStrength;
    fireWall = fireWall || existingFireWall;
    this.setNodeInfo(node, { type, strength, fireWall });
  }
  static clearVisited() {
    this.#visited = new Set();
    this.#isFound = false;
  }
  static depthFirstSearch(start, nodeToFind, strength) {
    if (strength <= 0) return;
    this.#visited.add(start);
    const destinations = this.#adjacencyList.get(start);
    if (destinations.includes(nodeToFind)) {
      this.#visited.add(nodeToFind);
      this.#isFound = true;
      return;
    }
    for (let destination of destinations) {
      const { type, fireWall } = this.getNodeInfo(destination);
      if (!fireWall.includes(start) && !this.#visited.has(destination)) {
        const modifiedStrength =
          type === "REPEATER" ? 2 * strength : strength - 1;
        this.depthFirstSearch(destination, nodeToFind, modifiedStrength);
        if (this.#isFound) return;
      }
    }
    this.#visited.delete(start);
  }
  static getPath(start, nodeToFind) {
    this.clearVisited();
    if (start === nodeToFind) return `${start}->${nodeToFind}`;
    const { strength } = this.getNodeInfo(start);
    this.depthFirstSearch(start, nodeToFind, strength);
    const path =
      this.#visited.size > 0 ? Array.from(this.#visited).join("->") : "";
    return path;
  }
  static adjacencyList() {
    return this.#adjacencyList;
  }
  static setNodeInfo(name, value) {
    this.#nodeInfo.set(name, value);
  }
  static getNodeInfo(name) {
    return this.#nodeInfo.get(name);
  }
  static nodeInfo() {
    return this.#nodeInfo;
  }
}

export default Graph;
