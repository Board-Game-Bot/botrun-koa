export interface CreateContainerDto {
  lang: string;
  code: string;
}

export interface RunContainerDto {
  containerId: string;
  input: string;
}