import Router from 'koa-router';
import { CreateContainerDto } from './dto.ts';
import { CreateContainerVo } from './vo.ts';
import { createContainer } from './service.ts';

export const router = new Router();

router.get('/foo', async (ctx) => {
  ctx.body = 'Hello Koa!';
});

router.post('/bar', async (ctx) => {
  ctx.body = 'Hello Koa!';
});

router.post('/create', async (ctx) => {
  const body = ctx.request.body as CreateContainerDto;

  const containerId = createContainer(body.lang, body.code);

  ctx.response.body = { containerId } as CreateContainerVo;
});
