import { helpers } from 'https://deno.land/x/oak@v10.2.1/mod.ts';

export default {
    getMessages: (ctx: any) => {
        ctx.response.body = Array.from(ctx.state.models.messages.values());
    },
    createMessage: async (ctx: any) => {
        const id = '5';

        const { value } = ctx.request.body({ type: 'json' });
        const { text } = await value;
        ctx.state.models.messages.set(id, {
            id,
            text,
            userId: ctx.state.me.id,
        });

        ctx.response.body = ctx.state.models.messages.get(id);
    },
    getMessage: (ctx: any) => {
        const { messageId } = helpers.getQuery(ctx, {mergeParams: true});
        ctx.response.body = ctx.state.models.users.get(messageId);
    }

        
};