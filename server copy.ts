import { Application, Router } from 'https://deno.land/x/oak@v10.2.1/mod.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';
import { 
    create, 
    Header, 
    Payload,
    getNumericDate,
    verify
} from 'https://deno.land/x/djwt@v2.4/mod.ts';
// import client from './database/index.ts';
// import { Recipe } from './models/index.ts';

const key = await crypto.subtle.generateKey(
    {name: "HMAC", hash: "SHA-512" },
    true,
    ["sign", "verify"],
);

const header: Header = {
    alg: "HS512", 
    typ: "JWT"
};

const payload: Payload = {
    iss: "Ted",
    exp: getNumericDate(15)
};


const router = new Router();
router
  .get("/newJwt", async (context) => {
    const jwt = await create(header, payload, key);
    context.response.body = jwt;
    context.cookies.set("token", jwt)
  })
  .get("/validate", async (context) => {
    let token = await context.cookies.get("token");
    if (token) {
      try {
        const result = await verify(token, key);
        context.response.body = "Valid Jwt";
      } catch(e) {
        context.response.body = "Invalid Jwt";
      }
      return;
    }
    context.response.body = "No token in cookies";
  })



const port = 8000;
const app = new Application();

app.use(async (ctx, next) => {
    ctx.state = {
        // client
    };
    await next();
});

app.addEventListener('listen', () => {
    console.log(`Listening on localhost: ${port}`);
});

app.use(router.routes());
app.use(router.allowedMethods());

let password = 'test';
const hash = await bcrypt.hash(password);
console.log(hash);

let comparison = await bcrypt.compare('test', hash);
console.log(comparison);



// const db = client.database('dino-cooking');
// const recipies = db.collection<Recipe>('recipies');
// const insertId = await recipies.insertOne({
//     author: 'Two Six',
//     title: 'Carbonara',
//     expected_time: 1200,
//     ingredients: [
//         {
//             name: 'cream',
//             amount: '2 spoons',
//         }
//     ],
//     description: 'Insert carbonara description',
//     instructions: 'Insert recipe instructions here',
//     donations: 'BTC address here',
// });

await app.listen({ port });