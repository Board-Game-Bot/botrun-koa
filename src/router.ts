import Router from 'koa-router';
import { CompileContainerDto, CreateContainerDto, RunContainerDto, StopContainerDto } from './dto';
import { CreateContainerVo } from './vo';
import { checkContainerMiddleware, compileContainer, createContainer, runContainer, stopContainer } from './service';

export const router = new Router();

router.get('/foo', async (ctx) => {
  ctx.body = 'Hello Koa!';
});

router.post('/bar', async (ctx) => {
  ctx.body = 'Hello Koa!';
});

router.use(checkContainerMiddleware);

router.post('/create', async (ctx) => {
  const body = ctx.request.body as CreateContainerDto;

  const containerId = createContainer(body.lang, body.code);

  ctx.response.body = { containerId } as CreateContainerVo;
});

router.post('/compile', async (ctx) => {
  const body = ctx.request.body as CompileContainerDto;
  ctx.response.body = {
    message: compileContainer(body),
  };
});

router.post('/run', async (ctx) => {
  const body = ctx.request.body as RunContainerDto;
  ctx.response.body = runContainer(body);
});

router.post('/stop', async (ctx) => {
  const body = ctx.request.body as StopContainerDto;
  stopContainer(body);
  ctx.response.status = 204;
});
