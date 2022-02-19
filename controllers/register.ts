import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User } from '../models/index.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';

export default {
  register: async (ctx: any) => {
    const { value } = ctx.request.body({type: 'json'});
    const { username, password, email } = await value;

    const db: Database = ctx.state.client.database('dino-cooking');
    const users = db.collection<User>('users');

    const userByName = await users.findOne({username});
    if(userByName !== undefined) {
      console.log('User exists!');
      return;
    }
    const userByMail = await users.findOne({email});
    if(userByMail !== undefined) {
      console.log('An account using this email address already exists!');
      return;
    }
    const insertId = await users.insertOne({
      username,
      password: await bcrypt.hash(password),
      email
    });
    console.log(username,await bcrypt.hash(password),email);
  }
};