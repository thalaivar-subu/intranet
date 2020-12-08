import { TEST_URL } from "../lib/constants";
import { post } from "axios";

describe("Create Device Test Cases", () => {
  const testCases = [
    { name: "A1", type: "COMPUTER", status: 200, msg: "Successfully added A1" },
    { name: "A2", type: "COMPUTER", status: 200, msg: "Successfully added A2" },
    { name: "A3", type: "COMPUTER", status: 200, msg: "Successfully added A3" },
    {
      name: "A3",
      type: "PHONE",
      status: 400,
      msg: "type 'PHONE' is not supported",
    },
    {
      name: "A1",
      type: "COMPUTER",
      status: 400,
      msg: "Device 'A1' already exists",
    },
    { name: "A4", type: "COMPUTER", status: 200, msg: "Successfully added A4" },
    { name: "A5", type: "COMPUTER", status: 200, msg: "Successfully added A5" },
    { name: "A6", type: "COMPUTER", status: 200, msg: "Successfully added A6" },
    { name: "R1", type: "REPEATER", status: 200, msg: "Successfully added R1" },
  ];
  for (let i = 0; i < testCases.length; i++) {
    const x = testCases[i];
    it(`Creating Device ${x.name} of Type ${x.type}`, async (done) => {
      try {
        const {
          status: statusCode,
          data: { msg: message },
        } = await post(
          `${TEST_URL}/ajiranet/process`,
          `CREATE /devices\ncontent-type : application/json\n\n{"type" : "${x.type}", "name" : "${x.name}"}`,
          { headers: { "Content-Type": "text/plain" } }
        );
        expect(statusCode).toBe(x.status);
        expect(message).toBe(x.msg);
        done();
      } catch (error) {
        expect(error.response.status).toBe(x.status);
        expect(error.response.data.msg).toBe(x.msg);
        done();
      }
    });
  }
});

describe("Create Device Connection", () => {
  const testCases = [
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "A1", "targets" : ["A2", "A3"]}`,
      status: 200,
      msg: "Successfully connected",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "A1", "targets" : ["A1"]}`,
      status: 400,
      msg: "Cannot connect device to itself",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "A1", "targets" : ["A2"]}`,
      status: 400,
      msg: "Devices are already connected",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "A5", "targets" : ["A4"]}`,
      status: 200,
      msg: "Successfully connected",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "R1", "targets" : ["A2"]}`,
      status: 200,
      msg: "Successfully connected",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "R1", "targets" : ["A5"]}`,
      status: 200,
      msg: "Successfully connected",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "R1"}`,
      status: 400,
      msg: "Invalid command syntax",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "A8", "targets" : ["A1"]}`,
      status: 400,
      msg: "Node 'A8' not found",
    },
    {
      input: `CREATE /connections\ncontent-type : application/json\n\n{"source" : "A2", "targets" : ["A4"]}`,
      status: 200,
      msg: "Successfully connected",
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    const x = testCases[i];
    it(`Creating Device Connection ->  ${x.input}`, async (done) => {
      try {
        const {
          status: statusCode,
          data: { msg: message },
        } = await post(`${TEST_URL}/ajiranet/process`, x.input, {
          headers: { "Content-Type": "text/plain" },
        });
        expect(statusCode).toBe(x.status);
        expect(message).toBe(x.msg);
        done();
      } catch (error) {
        expect(error.response.status).toBe(x.status);
        expect(error.response.data.msg).toBe(x.msg);
        done();
      }
    });
  }
});

describe("Modify Strength", () => {
  const testCases = [
    {
      input: `MODIFY /devices/A1/strength\ncontent-type : application/json\n\n{"value": "Helloworld"}`,
      status: 400,
      msg: "value should be an integer",
    },
    {
      input: `MODIFY /devices/A10/strength\ncontent-type : application/json\n\n{"value": "Helloworld"}`,
      status: 404,
      msg: "Device Not Found",
    },
    {
      input: `MODIFY /devices/A1/strength\ncontent-type : application/json\n\n{"value": 2}`,
      status: 200,
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    const x = testCases[i];
    it(`Modifying Strength -> ${x.input}`, async (done) => {
      try {
        const {
          status: statusCode,
          data: { msg: message },
        } = await post(`${TEST_URL}/ajiranet/process`, x.input, {
          headers: { "Content-Type": "text/plain" },
        });
        expect(statusCode).toBe(x.status);
        if (x.msg) expect(message).toBe(x.msg);
        done();
      } catch (error) {
        expect(error.response.status).toBe(x.status);
        expect(error.response.data.msg).toBe(x.msg);
        done();
      }
    });
  }
});

describe("Fetch Route Info", () => {
  const testCases = [
    {
      input: "FETCH /info-routes?from=A1&to=A4",
      status: 200,
      msg: "Route is A1->A2->A4",
    },
    {
      input: "FETCH /info-routes?from=A1&to=A5",
      status: 200,
      msg: "Route is A1->A2->R1->A5",
    },
    {
      input: "FETCH /info-routes?from=A4&to=A3",
      status: 200,
      // msg: "Route is A4->A2->A1->A3",
      msg: "Route is A4->A5->R1->A2->A1->A3",
    },
    {
      input: "FETCH /info-routes?from=A1&to=A1",
      status: 200,
      msg: "Route is A1->A1",
    },
    {
      input: "FETCH /info-routes?from=A1&to=A6",
      status: 404,
      msg: "Route not found",
    },
    {
      input: "FETCH /info-routes?from=A2&to=R1",
      status: 400,
      msg: "Route cannot be calculated with repeater",
    },
    {
      input: "FETCH /info-routes?from=A3",
      status: 400,
      msg: "Invalid Request",
    },
    {
      input: "FETCH /info-routes?from=A1&to=A10",
      status: 400,
      msg: "Node 'A10' not found",
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    const x = testCases[i];
    it(`Fetching Route Info for ${x.input}`, async (done) => {
      try {
        const {
          status: statusCode,
          data: { msg: message },
        } = await post(`${TEST_URL}/ajiranet/process`, x.input, {
          headers: { "Content-Type": "text/plain" },
        });
        expect(statusCode).toBe(x.status);
        expect(message).toBe(x.msg);
        done();
      } catch (error) {
        expect(error.response.status).toBe(x.status);
        expect(error.response.data.msg).toBe(x.msg);
        done();
      }
    });
  }
});

describe("Fetch Route Info", () => {
  it(`Fetching Devices Info`, async (done) => {
    const { status, data } = await post(
      `${TEST_URL}/ajiranet/process`,
      "FETCH /devices",
      { headers: { "Content-Type": "text/plain" } }
    );
    expect(status).toBe(200);
    expect({
      devices: [
        {
          type: "COMPUTER",
          name: "A1",
        },
        {
          type: "COMPUTER",
          name: "A2",
        },
        {
          type: "COMPUTER",
          name: "A3",
        },
        {
          type: "COMPUTER",
          name: "A4",
        },
        {
          type: "COMPUTER",
          name: "A5",
        },
        {
          type: "COMPUTER",
          name: "A6",
        },
        {
          type: "REPEATER",
          name: "R1",
        },
      ],
    }).toStrictEqual(data);
    done();
  });
});

describe("Modify FireWall", () => {
  const testCases = [
    {
      input: `MODIFY /devices/A2/firewall\ncontent-type : application/json\n\n{"devices": ["A1"]}`,
      status: 200,
      msg: "Successfully Added devices -> A1 to firewall of A2",
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    const x = testCases[i];
    it(`Modifying Firewall -> ${x.input}`, async (done) => {
      try {
        const {
          status: statusCode,
          data: { msg: message },
        } = await post(`${TEST_URL}/ajiranet/process`, x.input, {
          headers: { "Content-Type": "text/plain" },
        });
        expect(statusCode).toBe(x.status);
        if (x.msg) expect(message).toBe(x.msg);
        done();
      } catch (error) {
        expect(error.response.status).toBe(x.status);
        expect(error.response.data.msg).toBe(x.msg);
        done();
      }
    });
  }
});

describe("Fetch Route Info After FireWall", () => {
  const testCases = [
    {
      input: "FETCH /info-routes?from=A1&to=A5",
      status: 404,
      msg: "Route not found",
    },
    {
      input: "FETCH /info-routes?from=A5&to=A1",
      status: 200,
      msg: "Route is A5->A4->A2->A1",
    },
  ];
  for (let i = 0; i < testCases.length; i++) {
    const x = testCases[i];
    it(`Fetching Route Info for ${x.input}`, async (done) => {
      try {
        const {
          status: statusCode,
          data: { msg: message },
        } = await post(`${TEST_URL}/ajiranet/process`, x.input, {
          headers: { "Content-Type": "text/plain" },
        });
        expect(statusCode).toBe(x.status);
        expect(message).toBe(x.msg);
        done();
      } catch (error) {
        expect(error.response.status).toBe(x.status);
        expect(error.response.data.msg).toBe(x.msg);
        done();
      }
    });
  }
});
