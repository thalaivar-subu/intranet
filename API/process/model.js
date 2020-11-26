class Graph {
  static #adjacencyList = new Map();
  static #visited = new Set();
  static #isFound = false;
  static #nodeInfo = new Map();
  static addNode(v, type) {
    this.#adjacencyList.set(v, []);
    this.setNodeInfo(v, { strength: 5, type });
  }
  static addEdge(from, to) {
    this.#adjacencyList.get(from).push(to);
    this.#adjacencyList.get(to).push(from);
  }
  static modifyStrength(node, strength) {
    const { type } = this.getNodeInfo(node);
    this.setNodeInfo(node, { type, strength });
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
      if (!this.#visited.has(destination)) {
        const { type } = this.getNodeInfo(destination);
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
    return this.#visited.size > 0 ? Array.from(this.#visited).join("->") : "";
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
}

export default Graph;
