import { Bson } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { helpers } from 'https://deno.land/x/oak@v10.3.0/mod.ts';
import utils from '../utils/utils.ts';

export default {
  add: async (ctx: any) => {
    try {
      const {comments, recipies, verified, users} = await utils.valADbs(ctx);
      const { value } = ctx.request.body({type: "json"});
      const { content } = await value; 
      const recipeId = helpers.getQuery(ctx, {mergeParams: true});
      const recipe: any = await recipies.findOne({
        _id: {$eq: new Bson.ObjectId(recipeId.id)}
      });
      const user: any = await users.findOne({
        _id: {$eq: new Bson.ObjectId(verified)}
      });
      ctx.state.logger.def.debug(content);
      await comments.insertOne({
        userId: user._id,
        username: user.username,
        recipeId: recipe._id,
        content
      });
      ctx.state.logger.def.debug('Comment created');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }
};