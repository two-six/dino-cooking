import {Database, Collection, Bson} from 'https://deno.land/x/mongo@v0.29.2/mod.ts';
import djwt from '../utils/login.ts';
import { verify } from 'https://deno.land/x/djwt@v2.4/mod.ts';
import {User, Recipe} from '../models/index.ts';

export default {
  valADbs: async (ctx: any): Promise<{
    verified: string, 
    users: Collection<User>, 
    recipies: Collection<Recipe>
  }> => {
    const token = await ctx.cookies.get('userToken');
    const verified: any = await verify(token, djwt.key);
    ctx.state.logger.def.debug('User verified');
    const db: Database = ctx.state.client.database('dino-cooking');
    const users = db.collection<User>('users');
    const recipies = db.collection<Recipe>('recipies');
    return { verified: verified.id, users, recipies };
  }
}