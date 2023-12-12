export interface Tag {
  [key: string]: string;
}

export interface Config {
  tags: Record<string, string>;
  edgeDeviceName?: string;
}
