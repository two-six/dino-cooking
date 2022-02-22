import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User, Recipe, UserData } from '../models/index.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';
import djwt from '../utils/login.ts';
import { 
  create, 
  verify,
} from 'https://deno.land/x/djwt@v2.4/mod.ts';
import { helpers } from 'https://deno.land/x/oak@v10.3.0/mod.ts';
import utils from '../utils/utils.ts';


export default {
  view: async (ctx: any) => {
    try {
      const {verified, users, recipies} = await utils.valADbs(ctx);
      const user: any = await users.findOne({username: {$eq: verified.username}});
      const userRecipies = recipies.find({author: {$eq: user.username}});
      const data: UserData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        recipies: await userRecipies.toArray(),
      };
      ctx.response.body = data;
      ctx.state.logger.def.debug(`Data sent`);
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 402;
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
      ctx.response.body = 200;
    } else {
      ctx.state.logger.def.debug(`Invalid Password: ${userByName.username}`);
      ctx.response.body = 406;
    }
  },
  logout: (ctx: any) => {
    ctx.cookies.set('userToken', null);
    ctx.state.logger.def.debug(`userToken set to null`);
    ctx.state.body = 200;
  },
  register: async (ctx: any) => {
    const { value } = ctx.request.body({type: 'json'});
    const { username, password, email } = await value;

    const db: Database = ctx.state.client.database('dino-cooking');
    const users = db.collection<User>('users');

    const userByName = await users.findOne({username});
    if(userByName !== undefined) {
      ctx.response.body = 406;
      return;
    }
    const userByMail = await users.findOne({email});
    if(userByMail !== undefined) {
      ctx.response.body = 406;
      return;
    }
    await users.insertOne({
      username,
      password: await bcrypt.hash(password),
      email,
      role: "user"
    });
    ctx.state.logger.def.debug(`User registered: ${username}, ${await bcrypt.hash(password)}, ${email}`);
    ctx.response.body = 200;
  },
  remove: async (ctx: any) => {
    try {
      const {verified, users, recipies} = await utils.valADbs(ctx);
      const user: any = await users.findOne({username: {$eq: verified.username}});
      const iod = user._id;
      const value = helpers.getQuery(ctx, {mergeParams: true});
      if(iod.toString() != value.id) 
        throw(`User's not the owner of the account`);
      users.deleteOne({_id: {$eq: iod}});
      ctx.state.logger.def.debug('Account removed');
      recipies.deleteMany({author: {$eq: verified.username}});
      ctx.state.logger.def.debug(`All of user's recipies removed`);
      ctx.response.body = 200;
    } catch(e) {
      ctx.state.logger.steps.error(e);
      ctx.response.body = 401;
    }
  }
};