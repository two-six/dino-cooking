import { Application } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import client from './database/index.ts';
import { Recipe } from './models/index.ts';

const port = 8000;
const app = new Application();

app.use(async (ctx, next) => {
    ctx.state = {
        client
    };
    await next();
});

app.addEventListener('listen', () => {
    console.log(`Listening on localhost: ${port}`);
});

const db = client.database('dino-cooking');
const recipies = db.collection<Recipe>('recipies');

const insertId = await recipies.insertOne({
    author: 'Two Six',
    title: 'Carbonara',
    expected_time: 1200,
    ingredients: [
        {
            name: 'cream',
            amount: '2 spoons',
        }
    ],
    description: 'Insert carbonara description',
    instructions: 'Insert recipe instructions here',
    donations: 'BTC address here',
});

await app.listen({ port });