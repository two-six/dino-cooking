import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { Recipe, User } from '../models/index.ts';
import djwt from '../utils/login.ts';
import { verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';

export default {
  view: async (ctx: any) => {
    const db: Database = ctx.state.client.database('dino-cooking');
    const recipies = db.collection<Recipe>('recipies');
    const allRecipies = (await recipies.find({language: { $ne: -1 }}).toArray());

    ctx.response.body = allRecipies;
  },
  add: async (ctx: any) => {
    const token = await ctx.cookies.get('userToken');
    try {
      const verified: any = await verify(token, djwt.key);
      ctx.state.logger.def.debug('User verified');
      const { value } = ctx.request.body({type: 'json'});
      const recipeBody: Recipe = await value;
      const db: Database = ctx.state.client.database('dino-cooking');
      const recipies = db.collection<Recipe>('recipies');
      const users = db.collection<User>('users');
      const user: any = await users.findOne({username: {$eq: verified.username}});
      recipeBody.author = user.username;
      recipies.insertOne(recipeBody);
      ctx.state.logger.def.debug('New recipe added succesfully').
      ctx.response.body = 'Success';
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 'Error';
    }
  }
};