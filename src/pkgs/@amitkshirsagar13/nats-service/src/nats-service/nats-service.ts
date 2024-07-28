import ctx from "../utils/srvCtx";

export const buildService = async ({ name, version, description }: any) => {
  const srv = await ctx.getNC().services.add({ name, version, description });
  ctx.addSrv(srv);
  ctx
    .getService()
    .stopped.then(async () => {
      await ctx.getNC().drain();
      await ctx.getNC().close();
      ctx
        .getNC()
        .closed()
        .then(() => {
          console.log("Service Connection closed");
        });
    });
  return srv;
};
