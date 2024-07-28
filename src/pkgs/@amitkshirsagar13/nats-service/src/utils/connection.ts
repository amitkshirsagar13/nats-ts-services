import { connect, credsAuthenticator, NatsConnection } from "nats";

import { promises as fs } from 'fs';
import ctx from "./srvCtx";


const filePath = "src/creds/worker-service.creds";

async function readCreds(): Promise<Uint8Array> {
    const data = await fs.readFile(filePath);
    return new Uint8Array(data);
}

export const connectionToNats = async (): Promise<NatsConnection> => {
  if (!ctx.getNC()) {
    const creds: Uint8Array = await readCreds();
    let nc = await connect({
      servers: ["nats://nats.localtest.me:4222"],
      authenticator: credsAuthenticator(creds)
    });
    ctx.addNC(nc);
  }

  return ctx.getNC();
};
