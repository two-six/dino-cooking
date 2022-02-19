import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { Recipe } from '../models/index.ts';

export default {
  getRecipies: async (ctx: any) => {
    const db: Database = ctx.state.client.database('dino-cooking');
    const recipies = db.collection<Recipe>('recipies');
    const allRecipies = (await recipies.find({username: { $ne: 'test' }}).toArray());

    ctx.response.body = allRecipies;
  }
};