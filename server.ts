import client from './database/index.ts';
import { Application } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import routes from './routes/main.ts';

const port = 8000;
const app = new Application();

app.use(async (ctx, next) => {
    ctx.state = {
      client
    };
    await next();
});

for(const r of routes) {
  app.use(r.routes());
  app.use(r.allowedMethods());
}
app.addEventListener('listen', () => {
    console.log(`Listening on localhost: ${port}`);
});

await app.listen({ port });