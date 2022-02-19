export default {
    getHomepage: (ctx: any) => {
        ctx.response.type = 'html';
        ctx.response.body = '<h1>Some header</h1>';
    }
}