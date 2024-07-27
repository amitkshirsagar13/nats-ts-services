import { NatsConnection } from "nats";

export const buildService = async ({ nc, name, version, description }: any) => {
  const srv = await nc.services.add({ name, version, description });
  srv.stopped.then(async () => {
    await nc.drain();
    await nc.close();
    nc.closed().then(() => {
      console.log("Service Connection closed");
    });
  });
  return srv;
};
