import { execSync } from 'child_process';
import { rmSync, writeFileSync } from 'fs';
import { CONFIG, DockerConfig } from './docker.config';
import { RunContainerDto, StopContainerDto } from './dto.ts';
import { RunContainerVo } from './vo.ts';

const CONTAINER_MAP: Record<string, DockerConfig> = {};

export function createContainer(lang: string, code: string) {
  const { suffix, image, compileCmd } = CONFIG[lang];
  const FILENAME = `${Math.random() * 100000 | 0}.${suffix}`;
  const CREATE_CMD = `docker run --name botrun-${Math.random().toFixed(7)} -itd ${image}`;
  const containerId = execSync(CREATE_CMD).toString().trim();

  try {
    writeFileSync(FILENAME, code ?? '');

    const ADD_CODE_CMD = `docker cp ${FILENAME} ${containerId}:.`;
    execSync(ADD_CODE_CMD);

    rmSync(FILENAME);

    const COMPILE_CODE_CMD = `docker exec ${containerId} ${compileCmd} ${FILENAME}`;
    execSync(COMPILE_CODE_CMD);

    CONTAINER_MAP[containerId] = CONFIG[lang];
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

export function runContainer(dto: RunContainerDto): RunContainerVo {
  const { containerId, input } = dto;
  const dataFileName = `${Math.random() * 100000 | 0}.data`;

  writeFileSync(dataFileName, input);
  execSync(`docker cp ${dataFileName} ${containerId}:.`);
  rmSync(dataFileName);

  const runCmd = CONTAINER_MAP[containerId].runCmd;
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
  }
}