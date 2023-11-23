import { execSync } from 'child_process';
import { rmSync, writeFileSync } from 'fs';
import { CONFIG } from './docker.config';

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
