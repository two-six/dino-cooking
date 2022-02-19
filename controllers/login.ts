import { Database } from 'https://deno.land/x/mongo@v0.29.1/mod.ts';
import { User } from '../models/index.ts';
import log from '../utils/logger.ts';
import * as bcrypt from 'https://deno.land/x/bcrypt@v0.3.0/mod.ts';
import djwt from '../utils/login.ts';
import { 
  create, 
  getNumericDate, 
  verify,
  Payload
} from 'https://deno.land/x/djwt@v2.4/mod.ts';

export default {
  login: async (ctx: any) => {
    const { value } = ctx.request.body({type: 'json'});
    const { username, password } = await value;
    const db: Database = ctx.state.client.database('dino-cooking');
    const users = db.collection<User>('users');
    const userByName = await users.findOne({username});

    if(userByName === undefined) {
      log.def.debug(`Couldn't find user`);
      return;
    }
    if(await bcrypt.compare(password, userByName.password)) {
      log.def.debug(`Valid credentials: ${userByName.username}`);
      const payload: Payload ={
        name: userByName.username,
        exp: getNumericDate(60 * 2)
      };
      const jwt = await create(djwt.header, payload, djwt.key);
      ctx.cookies.set('userToken', jwt);
      log.def.debug(`JWT token created: ${userByName.username}`);
      ctx.response.body ='Logged in!';
    } else {
      log.def.debug(`Invalid Password: ${userByName.username}`);
    }
  }
};