import { Database, Bson } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { Recipe } from '../models/index.ts';
import { helpers } from 'https://deno.land/x/oak@v10.3.0/mod.ts';
import utils from '../utils/utils.ts';

export default {
  makeMod: async (ctx: any) => {
    try {

      const {verified, users} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin") 
        throw("User is not an admin");
      const value = helpers.getQuery(ctx, {mergeParams: true});
      await users.updateOne(
        {_id: {$eq: new Bson.ObjectId(value.id)}},
        {$set: {role: "moderator"}}
      );
      ctx.state.logger.def.debug(`User's account updated to moderator`);
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }
}