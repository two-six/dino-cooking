import { Database, Bson } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User, RecipeHeader } from '../models/index.ts';
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
  },
  comAccept: async (ctx: any) => {
    try {
      const {verified, users, comments} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin" && curUser?.role !== "moderator") 
        throw("User is not an admin or moderator");
      const value = helpers.getQuery(ctx, {mergeParams: true});
      const curCom = await comments.findOne(
        {_id: {$eq: new Bson.ObjectId(value.id)}}
      );
      if(curCom?.accepted)
        throw("This comment is already accepted!");
      comments.updateOne(
        {_id: {$eq: new Bson.ObjectId(value.id)}},
        {accepted: true}
      );
      ctx.state.logger.def.debug('Comment accepted succesfully');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  viewRec: async(ctx: any) => {
    try {
      const {verified, users, recipies} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin" && curUser?.role !== "moderator") 
        throw("User is not an admin or moderator");
      const allRecipies = await recipies.find({
        accepted: {$eq: false}
      }).toArray();
      ctx.response.body = allRecipies;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  viewCom: async(ctx: any) => {
    try {
      const {verified, users, comments} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin" && curUser?.role !== "moderator") 
        throw("User is not an admin or moderator");
      const allComments = await comments.find({
        accepted: {$eq: false}
      }).toArray();
      ctx.response.body = allComments;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  recAccept: async(ctx: any) => {
    try {
      const {verified, users, recipies, headers} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin" && curUser?.role !== "moderator")
        throw("User is not an admin or moderator");
      const value = helpers.getQuery(ctx, {mergeParams: true});
      await recipies.updateOne(
        {_id: {$eq: new Bson.ObjectId(value.id)}},
        {accepted: true}
      );
      ctx.state.logger.def.debug('Recipe accepted');
      const curRecipe: any = await recipies.findOne({
        _id: {$eq: new Bson.ObjectId(value.id)}
      });
      const header: RecipeHeader = {
        recipe_id: curRecipe?._id,
        author: curRecipe?.author,
        title: curRecipe?.title,
        language: curRecipe?.language,
        expected_time: curRecipe?.expected_time,
        rating: 0
      };
      await headers.insertOne(header);
      ctx.state.logger.def.debug('Header created');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  comDecline: async(ctx: any) => {
    try {
      const {verified, users, comments} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin" && curUser?.role !== "moderator") 
        throw("User is not an admin or moderator");
      const value = helpers.getQuery(ctx, {mergeParams: true});
      const curCom = await comments.findOne(
        {_id: {$eq: new Bson.ObjectId(value.id)}}
      );
      if(curCom?.accepted)
        throw("This comment is already accepted!");
      comments.deleteOne({
        _id: {$eq: new Bson.ObjectId(value.id)}
      });
      ctx.state.logger.def.debug('Comment deleted succesfully');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  recDecline: async(ctx: any) => {
    try {
      const {verified, users, recipies} = await utils.valADbs(ctx);
      const curUser = await users.findOne(
        {_id: {$eq: new Bson.ObjectId(verified)}}
      );
      if(curUser?.role !== "admin" && curUser?.role !== "moderator")
        throw("User is not an admin or moderator");
      const value = helpers.getQuery(ctx, {mergeParams: true});
      const curRecipe = await recipies.findOne({
        _id: {$eq: new Bson.ObjectId(value.id)}
      });
      if(curRecipe?.accepted) 
        throw("This recipe is already accepted!");
      recipies.deleteOne({
        _id: {$eq: new Bson.ObjectId(value.id)}
      });
      ctx.state.logger.def.debug('Recipe removed succesfully');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }

  }
}