import { execSync } from 'child_process';
import { rmSync, writeFileSync } from 'fs';
import { Middleware } from 'koa';
import { CONFIG, DockerConfig } from './docker.config';
import { CompileContainerDto, RunContainerDto, StopContainerDto } from './dto';
import { RunContainerVo } from './vo';

const CONTAINER_MAP: Record<string, DockerConfig> = {};
const FILENAME_MAP: Record<string, string> = {};

export const checkContainerMiddleware: Middleware = async (ctx, next) => {
  const { containerId } = ctx.request.body as { containerId?: string};
  if (containerId && !CONTAINER_MAP[containerId]) {
    ctx.status = 400;
    ctx.body = {
      message: ` The Container \`${containerId}\` does not exist.`,
    };
  }
  else {
    await next();
  }
};

export function createContainer(lang: string, code: string) {
  const { suffix, image } = CONFIG[lang];
  const FILENAME = `${Math.random() * 100000 | 0}.${suffix}`;
  const CREATE_CMD = `docker run --name botrun-${Math.random().toFixed(7)} -itd ${image}`;
  const containerId = execSync(CREATE_CMD).toString().trim();

  try {
    writeFileSync(FILENAME, code ?? '');

    const ADD_CODE_CMD = `docker cp ${FILENAME} ${containerId}:.`;
    execSync(ADD_CODE_CMD);

    rmSync(FILENAME);

    CONTAINER_MAP[containerId] = CONFIG[lang];
    FILENAME_MAP[containerId] = FILENAME;
    return containerId;
  }
  catch (e) {
    console.error(e);
    try {
      execSync(`docker kill ${containerId}`);
    }
    finally {
      execSync(`docker rm ${containerId}`);
    }
  }
}

export function compileContainer(dto: CompileContainerDto) {
  const { containerId } = dto;
  const FILENAME = FILENAME_MAP[containerId];
  const { compileCmd } = CONTAINER_MAP[containerId];
  const COMPILE_CODE_CMD = `docker exec ${containerId} /bin/sh -c "${compileCmd(FILENAME)}"`;
  try {
    execSync(COMPILE_CODE_CMD);
    return;
  }
  catch (e: any) {
    return e.message.split('\n').slice(1).join('\n');
  }
}

export function runContainer(dto: RunContainerDto): RunContainerVo {
  const { containerId, input } = dto;
  const dataFileName = `${Math.random() * 100000 | 0}.data`;

  writeFileSync(dataFileName, input);
  execSync(`docker cp ${dataFileName} ${containerId}:.`);
  rmSync(dataFileName);

  const runCmd = CONTAINER_MAP[containerId].runCmd(FILENAME_MAP[containerId]);
  const RUN_CMD = `docker exec ${containerId} /bin/sh -c "${runCmd} < ./${dataFileName}"`;
  const output = execSync(RUN_CMD).toString().trim();

  return { output };
}

export function stopContainer(dto: StopContainerDto) {
  const { containerId } = dto;
  try {
    try {
      execSync(`docker kill ${containerId}`);
    }
    finally {
      execSync(`docker rm ${containerId}`);
    }
  }
  finally {
    delete CONTAINER_MAP[containerId];
    delete FILENAME_MAP[containerId];
  }
}