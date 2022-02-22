import { Database, Bson } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { Recipe, User } from '../models/index.ts';
import djwt from '../utils/login.ts';
import { verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';
import { helpers } from 'https://deno.land/x/oak@v10.3.0/mod.ts';

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
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  remove: async (ctx: any) => {
    const token = await ctx.cookies.get('userToken');
    try {
      const verified: any = await verify(token, djwt.key);
      ctx.state.logger.def.debug('User verified');
      const db: Database = ctx.state.client.database('dino-cooking');
      const users = db.collection<User>('users');
      const user: any = await users.findOne({username: {$eq: verified.username}});
      const value = helpers.getQuery(ctx, {mergeParams: true});
      ctx.state.logger.def.debug(value);
      const oid = new Bson.ObjectId(value.id);
      const recipies = db.collection<Recipe>('recipies');
      const recipe = await recipies.findOne({_id: {$eq: oid}});
      if(user.username != recipe?.author) 
        throw(`User's not the owner of the recipe`);
      recipies.deleteOne({_id: {$eq: oid}});
      ctx.state.logger.def.debug('Recipe removed');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }
};