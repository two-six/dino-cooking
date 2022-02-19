import { Application } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import { DsDDB } from "https://deno.land/x/dsddb@v2.1.0/mod.ts";

import models from './models/index.ts';
import routes from './routes/index.ts';

const port = 8000;
const app = new Application();

app.use(async (ctx, next) => {
    ctx.state = { 
        models,
        me: models.users.get('1'),
    };

    await next();
});

app.use(routes.session.allowedMethods());
app.use(routes.session.routes());
app.use(routes.user.allowedMethods());
app.use(routes.user.routes());
app.use(routes.message.allowedMethods());
app.use(routes.message.routes());

app.addEventListener('listen', () => {
    console.log(`Listening on localhost: ${port}`);
});

let db = new DsDDB('./database/db.json');

await db.load();

db.set('key', 'value');

await db.write();

await app.listen({ port });