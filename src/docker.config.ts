export interface DockerConfig {
  suffix: string;
  image: string;
  compileCmd: (...args: string[]) => string;
  runCmd: (...args: string[]) => string;
}

export const CONFIG: Record<string, DockerConfig> = {
  'c++': {
    suffix: 'cc',
    image: 'frolvlad/alpine-gxx',
    compileCmd: (FILENAME) => `g++ ${FILENAME}`,
    runCmd: () => './a.out',
  },
  python: {
    suffix: 'py',
    image: 'frolvlad/alpine-python3',
    compileCmd: (FILENAME) => `python -m py_compile ${FILENAME}`,
    runCmd: (FILENAME) => `python ${FILENAME}`,
  },
  go: {
    suffix: 'go',
    image: 'frolvlad/alpine-go',
    compileCmd: (FILENAME) => `go build -o a.out ${FILENAME}`,
    runCmd: () => './a.out',
  },
  java: {
    suffix: 'java',
    image: 'frolvlad/alpine-java',
    compileCmd: (FILENAME) => `javac ${FILENAME}`,
    runCmd: () => 'java Main',
  },
};
