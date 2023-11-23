interface DockerConfig {
  suffix: string;
  image: string;
  compileCmd: string;
}

export const CONFIG: Record<string, DockerConfig> = {
  cpp: {
    suffix: 'cc',
    image: 'frolvlad/alpine-gxx',
    compileCmd: 'g++',
  },
};