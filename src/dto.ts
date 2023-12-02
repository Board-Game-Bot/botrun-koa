export interface CreateContainerDto {
  lang: string;
  code: string;
}

export interface RunContainerDto {
  containerId: string;
  input: string;
}

export interface CompileContainerDto {
  containerId: string;
}

export interface StopContainerDto {
  containerId: string;
}