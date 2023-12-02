import { exec, execSync } from 'child_process';
import { CONFIG } from './docker.config';

export const initDockerImages = () => {
  const existImages =
    execSync('docker images')
      .toString()
      .split('\n')
      .slice(1)
      .map(x => x.split(' ')[0])
      .filter(x => x);

  const needImages = Object.values(CONFIG)
    .map(x => x.image);

  const shouldPullImages = needImages
    .filter(image => !existImages.includes(image));

  shouldPullImages.forEach(image => {
    console.log(`Pulling image ${image}...`);
    exec(`docker pull ${image}:latest`, () => {
      console.log(`Pull image ${image} successfully`);
    });
  });
};