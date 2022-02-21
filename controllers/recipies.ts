import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { Recipe } from '../models/index.ts';
import djwt from '../utils/login.ts';
import { verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';

export default {
  viewRecipies: async (ctx: any) => {
    const db: Database = ctx.state.client.database('dino-cooking');
    const recipies = db.collection<Recipe>('recipies');
    const allRecipies = (await recipies.find({language: { $ne: -1 }}).toArray());

    ctx.response.body = allRecipies;
  },
  addRecipe: (ctx: any) => {
    const db: Database = ctx.state.client.database('dino-cooking');
    const recipies = db.collection<Recipe>('recipies');
  }
};