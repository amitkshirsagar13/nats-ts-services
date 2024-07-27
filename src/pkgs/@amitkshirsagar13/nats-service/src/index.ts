import { NatsConnection } from "nats";
import { connectionToNats } from "./utils/connection";
import { buildService } from "./nats-service/nats-service";
import { format } from "path";

const microService = async () => {
  const nc: NatsConnection = await connectionToNats();
  return buildService({
    nc,
    name: "math",
    version: "1.0.0",
    description: "Math Service",
  });
};

const getSrvRootEndpoint = async (rootPath: string) => {
  const srv = await microService();
  return { root: srv.addGroup(rootPath), srv };
};

const maxHandler = (srv: any) => {
  return (err: any, msg: any) => {
    if (err) {
      console.log("err", err);
      srv.stop(err).finally(() => {});
    }
    const values:number[] = msg.json();
    console.log("input", values);
    if (values) {
      msg?.respond(JSON.stringify({ max: Math.max(...values)}, null, 2));
    }
  };
};

const addEndpoint = async (srvRt: any, endpoint: string, handler: any) => {
  srvRt.root.addEndpoint(endpoint, {
    handler,
    metadata: {
      schema: "input a JSON serialized JSON array, output the largest value",
      description: "Find the largest value in the array",
      format: "application/json",
      request_schema: "number[]",
      response_schema: "{max: number}"
    },
  });
}

const addEndpointNoHandler = async (srvRt: any, endpoint: string) => {
  const max = srvRt.root.addEndpoint(endpoint, {
    metadata: {
      schema: "input a JSON serialized JSON array, output the largest value",
      format: "application/json",
      request_schema: "number[]",
      response_schema: "{min: number}"
    },
  });
  (async () => {
    for await (const msg of max) {
      const values: number[] = msg.json();
      console.log("input", values);
      if (values) {
        msg?.respond(JSON.stringify({ min: values[0] }));
      }
    }
  })().catch((err) => {
    console.log("err", err);
    srvRt.srv.stop(err).finally(() => {});
  });
};

const startService = async () => {
  const srvRt = await getSrvRootEndpoint("math");
  addEndpoint(srvRt, "max", maxHandler(srvRt.srv));
  addEndpointNoHandler(srvRt, "min");
};

startService();
