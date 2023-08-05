type Timestamp = {
  ts: number;
};

export type MousePosition = {
  x: number;
  y: number;
} & Timestamp;

export type CpuLoad = {
  load: number;
} & Timestamp;
