import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User } from '../models/index.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';

export default {
  register: async (ctx: any) => {
    const { value } = ctx.request.body({type: 'json'});
    const { username, password, email } = await value;

    const db: Database = ctx.state.client.database('dino-cooking');
    const recipies = db.collection<User>('users');

    const userByName = await recipies.findOne({"username": username});
    const userByMail = await recipies.findOne({"email": email});
    if(userByName !== undefined) {
      console.log('User exists!');
      return;
    }
    if(userByMail !== undefined) {
      console.log('An account using this email address already exists!');
      return;
    }
    const insertId = await recipies.insertOne({
      username,
      password: await bcrypt.hash(password),
      email
    });
    console.log(username,await bcrypt.hash(password),email);
  }
};