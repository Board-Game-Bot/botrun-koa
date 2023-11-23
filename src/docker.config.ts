export interface DockerConfig {
  suffix: string;
  image: string;
  compileCmd: string;
  runCmd: string;
}

export const CONFIG: Record<string, DockerConfig> = {
  cpp: {
    suffix: 'cc',
    image: 'frolvlad/alpine-gxx',
    compileCmd: 'g++',
    runCmd: './a.out',
  },
};