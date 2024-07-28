import { connectionToNats } from "./utils/connection";
import { buildService } from "./nats-service/nats-service";
import ctx from "./utils/srvCtx";

const microService = async () => {
  await connectionToNats();
  return buildService({
    name: "math",
    version: "1.0.0",
    description: "Math Service",
  });
};

const getSrvRootEndpoint = async (rootPath: string) => {
  const srv = await microService();
  const root = srv.addGroup(rootPath);
  ctx.addGroup(root);
  return { root, srv };
};

const maxHandler = () => {
  return (err: any, msg: any) => {
    if (err) {
      console.log("err", err);
      ctx.getService().stop(err).finally(() => {});
    }
    const values:number[] = msg.json();
    console.log("input", values);
    if (values) {
      msg?.respond(JSON.stringify({ max: Math.max(...values)}, null, 2));
    }
  };
};

const addEndpoint = async (endpoint: string, handler: any) => {
  ctx.getGroup().addEndpoint(endpoint, {
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

const addEndpointNoHandler = async (endpoint: string) => {
  const max = ctx.getGroup().addEndpoint(endpoint, {
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
    ctx.getService().stop(err).finally(() => {});
  });
};

const startService = async () => {
  const srvRt = await getSrvRootEndpoint("math");
  addEndpoint("max", maxHandler());
  addEndpointNoHandler("min");
};

startService();
