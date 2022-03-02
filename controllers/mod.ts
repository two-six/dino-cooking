import { Database, Bson } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User } from '../models/index.ts';
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
  },
  removeMod: async (ctx: any) => {
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
        {$set: {role: "user"}}
      );
      ctx.state.logger.def.debug(`Moderator's account updated to user`);
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  viewMod: async (ctx: any) => {
    try {
      const db: Database = ctx.state.client.database('dino-cooking');
      const users = db.collection<User>('users'); 
      const allModerators = await users.find({
          $or: [
            {role: {$eq: "moderator"}},
            {role: {$eq: "admin"}}
          ]
      }).toArray();
      ctx.response.body = allModerators;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }
}