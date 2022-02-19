import { helpers } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

export default {
    getUsers: (ctx: any) => {
        ctx.response.body = Array.from(ctx.state.models.users.values());
    },
    getUser: (ctx: any) => {
        const { userId } = helpers.getQuery(ctx, {mergeParams: true});
        ctx.response.body = ctx.state.models.users.get(userId);
    }
}