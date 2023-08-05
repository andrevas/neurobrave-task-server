import { Injectable } from '@nestjs/common';
import { CpuLoad, MousePosition } from './streams.interface';
import { RingBuffer } from 'ring-buffer-ts';

@Injectable()
export class StreamsService {
  private readonly mousePositions: {
    [key: string]: RingBuffer<MousePosition>;
  } = {};
  private readonly cpuLoads: { [key: string]: RingBuffer<CpuLoad> } = {};

  pushMousePosition(socketId: string, incomingMousePositions: MousePosition[]) {
    if (!this.mousePositions[socketId]) {
      this.mousePositions[socketId] = new RingBuffer<MousePosition>(30);
    }
    this.mousePositions[socketId].add(...incomingMousePositions);
  }

  getMousePositionsForSocketId(socketId: string): MousePosition[] {
    return Object.keys(this.mousePositions).includes(socketId)
      ? this.mousePositions[socketId].toArray()
      : [];
  }

  pushCpuLoads(socketId: string, incomingCpuLoads: CpuLoad[]) {
    if (!this.cpuLoads[socketId]) {
      this.cpuLoads[socketId] = new RingBuffer<CpuLoad>(30);
    }
    this.cpuLoads[socketId].add(...incomingCpuLoads);
  }

  getCpuLoadsForSocketId(socketId: string): CpuLoad[] {
    return Object.keys(this.cpuLoads).includes(socketId)
      ? this.cpuLoads[socketId].toArray()
      : [];
  }

  deleteMousePositionsForSocketId(socketId: string): void {
    if (this.mousePositions[socketId]) {
      delete this.mousePositions[socketId];
    }
  }

  deleteCpuLoadsForSocketId(socketId: string): void {
    if (this.cpuLoads[socketId]) {
      delete this.cpuLoads[socketId];
    }
  }
}
