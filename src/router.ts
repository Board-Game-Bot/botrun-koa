import Router from 'koa-router';

export const router = new Router();

router.get('/foo', async (ctx) => {
  ctx.body = 'Hello Koa!';
});

router.post('/bar', async (ctx) => {
  ctx.body = 'Hello Koa!';
});
