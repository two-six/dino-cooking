import client from './database/index.ts';
import { Application } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import routes from './routes/main.ts';
import logger from './utils/logger.ts';
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const port = 8000;
const app = new Application();
app.use(oakCors());

app.use(async (ctx, next) => {
  ctx.state = {
    client,
    logger
  };
  await next();
});

routes.forEach((r) => {
  app.use(r.routes());
  app.use(r.allowedMethods());
});

app.addEventListener('listen', () => {
  logger.steps.info(`Listening on localhost:${port}`);
});

await app.listen({ port });