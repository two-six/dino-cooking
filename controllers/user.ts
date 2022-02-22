import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User, Recipe, UserData } from '../models/index.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';
import djwt from '../utils/login.ts';
import { 
  create, 
  verify,
} from 'https://deno.land/x/djwt@v2.4/mod.ts';

export default {
  view: async (ctx: any) => {
    const token = await ctx.cookies.get('userToken');
    try {
      const verified: any = await verify(token, djwt.key);
      ctx.state.logger.def.debug('User verified');
      const db: Database = ctx.state.client.database('dino-cooking');
      const users = db.collection<User>('users');
      const user: any = await users.findOne({username: {$eq: verified.username}});
      const recipies = db.collection<Recipe>('recipies');
      const userRecipies = recipies.find({author: {$eq: user.username}});
      const data: UserData = {
        username: user.username,
        email: user.email,
        recipies: await userRecipies.toArray(),
      };
      ctx.response.body = data;
      ctx.state.logger.def.debug(`Data sent`);
    } catch(e) {
      ctx.state.logger.steps.error(e);
    }
  },
  login: async (ctx: any) => {
    const { value } = ctx.request.body({type: 'json'});
    const { username, password } = await value;
    const db: Database = ctx.state.client.database('dino-cooking');
    const users = db.collection<User>('users');

    ctx.state.logger.def.debug(`Finding user...`);
    const userByName = await users.findOne({username});

    if(userByName === undefined) {
      ctx.state.logger.def.debug(`Couldn't find user`);
      return;
    }
    if(await bcrypt.compare(password, userByName.password)) {
      ctx.state.logger.def.debug(`Valid credentials: ${userByName.username}`);

      const token = await ctx.cookies.get('userToken');
      if(token) {
        try {
          await verify(token, djwt.key);
          ctx.response.body = 'User already logged in';
          ctx.state.logger.def.debug(`User already logged in: ${userByName.username}`);
          return;
        } catch(e) {
          ctx.state.logger.steps.warning(e);
        } 
        ctx.state.logger.def.debug(`User not logged in already: ${userByName.username}`);
      }
      const jwt = await create(djwt.header, {username: userByName.username}, djwt.key);
      ctx.cookies.set('userToken', jwt);
      ctx.state.logger.def.debug(`JWT token created: ${userByName.username}`);
      ctx.response.body ='Logged in!';
    } else {
      ctx.state.logger.def.debug(`Invalid Password: ${userByName.username}`);
    }
  },
  logout: (ctx: any) => {
    ctx.cookies.set('userToken', null);
    ctx.state.logger.def.debug(`userToken set to null`);
  },
  register: async (ctx: any) => {
    const { value } = ctx.request.body({type: 'json'});
    const { username, password, email } = await value;

    const db: Database = ctx.state.client.database('dino-cooking');
    const users = db.collection<User>('users');

    const userByName = await users.findOne({username});
    if(userByName !== undefined) {
      ctx.response.body = 'User exists!';
      return;
    }
    const userByMail = await users.findOne({email});
    if(userByMail !== undefined) {
      ctx.response.body = 'An account using this email address already exists!';
      return;
    }
    await users.insertOne({
      username,
      password: await bcrypt.hash(password),
      email
    });
    ctx.state.logger.def.debug(`User registered: ${username}, ${await bcrypt.hash(password)}, ${email}`);
  }
};