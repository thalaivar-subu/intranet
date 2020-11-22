import { addNode, adjacencyList } from "./model";

const Create = async ({ type, name }, res) => {
  if (adjacencyList.has(name)) {
    res.status(400).json({ msg: `Device '${name}' already exists` });
  } else {
    addNode(name);
    res.status(200).json({ msg: `Successfully added ${name}` });
  }
};
const Fetch = async () => {};
const Modify = async () => {};

export { Create, Fetch, Modify };
