import { NatsConnection, Service, ServiceGroup, ServiceMsg } from "nats";

const ctx: any = {
    eps: {},
    addNC: function (nc: NatsConnection, name: string = "nc") {
      this[name] = nc;
    },
    getNC: function (name: string = "nc"): NatsConnection {
      return this[name];
    },
    addSrv: function (srv: Service, name: string = "srv") {
      this[name] = srv;
    },
    getService: function (name: string = "srv"): Service {
      return this[name];
    },
    addGroup: function (grp: ServiceGroup, name: string = "grp") {
      this[name] = grp;
    },
    getGroup: function (name: string = "grp"): ServiceGroup {
      return this[name];
    },
    addEndpoint: function (ep: ServiceMsg, name: string) {
      this["eps"][name] = ep;
    },
    getEndpoint: function (name: string): ServiceMsg {
      return this["eps"][name];
    },
  };

  export default ctx;