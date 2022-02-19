export default {
    getSession: (ctx: any) => {
        ctx.response.body = ctx.state.models.users.get(ctx.state.me.id);
    }
}