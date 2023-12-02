import koa from 'koa';
import cors from 'koa2-cors';
import bodyParser from 'koa-bodyparser';
import { router } from './router';
import { initDockerImages } from './utils';

const PORT = 3001;

function bootstrap() {
  const server = new koa();
  
  server
    .use(cors())
    .use(bodyParser())
    .use(router.routes());

  initDockerImages();

  server.listen(PORT, () => {
    console.log(`Bot Running System Server run on port ${PORT}...`);
  });
}

bootstrap();
