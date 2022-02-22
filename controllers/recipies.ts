import { Bson } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { Recipe } from '../models/index.ts';
import { helpers } from 'https://deno.land/x/oak@v10.3.0/mod.ts';
import utils from '../utils/utils.ts';

export default {
  view: async (ctx: any) => {
    const {recipies} = await utils.valADbs(ctx);
    const allRecipies = (await recipies.find({language: { $ne: "" }}).toArray());

    ctx.response.body = allRecipies;
  },
  add: async (ctx: any) => {
    try {
      const {verified, recipies, users} = await utils.valADbs(ctx);
      const { value } = ctx.request.body({type: "json"});
      const recipeBody: Recipe = await value;
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
    try {
      const {verified, users, recipies} = await utils.valADbs(ctx);
      const user: any = await users.findOne({username: {$eq: verified.username}});
      const value = helpers.getQuery(ctx, {mergeParams: true});
      const oid = new Bson.ObjectId(value.id);
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
  },
  edit: async (ctx: any) => {
    try {
      const {verified, recipies} = await utils.valADbs(ctx);
      const value = helpers.getQuery(ctx, {mergeParams: true});
      const oid = new Bson.ObjectId(value.id);
      let recipe: any = await recipies.findOne({_id: {$eq: oid}});
      if(recipe?.author !== verified.username) 
        throw(`User's not the owner of the recipe`);
      const reqValue =  ctx.request.body({type: 'json'});
      const res = await reqValue.value;
      ctx.state.logger.def.debug(res);
      Object.entries(res).forEach((entry) => {
        const [ key, val ] = entry;
        if(key == "_id" || key == "language" || key == "author")
          throw(`Invalid field!`);
        recipe[key] = val;
      });
      await recipies.replaceOne(
        {_id: {$eq: oid}},
        recipe
      );
      ctx.state.logger.def.debug('Recipe updated');
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 402;
    }
  }
};