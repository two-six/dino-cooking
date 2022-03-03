import { Bson, Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { helpers } from 'https://deno.land/x/oak@v10.3.0/mod.ts';
import { Comment } from '../models/index.ts';
import utils from '../utils/utils.ts';

export default {
  view: async (ctx: any) => {
    try {
      const db: Database = ctx.state.client.database('dino-cooking');
      const comments = db.collection<Comment>('comments');
      const value = helpers.getQuery(ctx, {mergeParams: true});
      const allComments = await comments.find({
        $and: [
          {recipeId: {$eq: new Bson.ObjectId(value.id)}},
          {accepted: {$eq: true}}
        ]
      }).toArray();
      ctx.response.body = allComments;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }, 
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
        content,
        accepted: false
      });
      ctx.state.logger.def.debug('Comment created');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  remove: async (ctx: any) => {
    try {
      const {verified, comments} = await utils.valADbs(ctx);
      const commentId = helpers.getQuery(ctx, {mergeParams: true});
      const com = await comments.findOne({
        _id: {$eq: new Bson.ObjectId(commentId.id)}
      });
      if(com?.userId.toString() !== verified) 
        throw("Invalid user");
      const dCount = await comments.deleteOne({
        _id: {$eq: new Bson.ObjectId(commentId.id)}
      });
      if(dCount < 1) 
        ctx.state.logger.steps.info('No comments removed');
      else
        ctx.state.logger.def.debug('Comment removed');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  },
  edit: async (ctx: any) => {
    try {
      const {verified, comments} = await utils.valADbs(ctx);
      const commentId = helpers.getQuery(ctx, {mergeParams: true});
      const com = await comments.findOne({
        _id: {$eq: new Bson.ObjectId(commentId.id)}
      });
      if(com?.userId.toString() !== verified)
        throw("Invalid user");
      const { value } = ctx.request.body({type: "json"});
      const { content } = await value; 
      const {modifiedCount} = await comments.updateOne(
        {_id: {$eq: new Bson.ObjectId(commentId.id)}},
        {$set: {content}}
      );
      if(modifiedCount < 1)
        ctx.state.logger.steps.info('No comments modified');
      else
        ctx.state.logger.def.debug('Comment editied succesfuly');
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }
};