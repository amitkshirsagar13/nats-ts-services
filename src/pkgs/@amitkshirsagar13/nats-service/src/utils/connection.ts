import {connect, NatsConnectionOptions, Payload} from 'ts-nats';

export const connectToNats = async (options: NatsConnectionOptions) => {
    let nc = await connect({servers: ['nats://nats.localtest.me:4222', 'tls://nats.localtest.me:4443']});
    // Do something with the connection
  return nc;
};