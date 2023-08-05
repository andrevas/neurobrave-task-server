// websocket.gateway.ts

import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StreamsService } from './streams.service';

@WebSocketGateway({ cors: true })
export class StreamsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(StreamsGateway.name);

  @WebSocketServer()
  server: Server;

  private connectedSockets: Map<string, Socket> = new Map();

  constructor(private streamsService: StreamsService) {}

  handleConnection(socket: Socket) {
    this.logger.log(`Client connected: ${socket.id}`);
    this.connectedSockets.set(socket.id, socket);
  }

  @SubscribeMessage('add-mouse-pos')
  handleMousePositionEvent(socket: any, data: any) {
    this.streamsService.pushMousePosition(socket.id, data.buffer);
    socket.emit(
      'mouse-pos',
      this.streamsService.getMousePositionsForSocketId(socket.id),
    );
  }

  @SubscribeMessage('add-cpu-load')
  handleCPULoadEvent(socket: any, data: any) {
    this.streamsService.pushCpuLoads(socket.id, data.buffer);
    const client = this.connectedSockets.get(socket.id);
    client.emit(
      'cpu-load',
      this.streamsService.getCpuLoadsForSocketId(socket.id),
    );
  }

  handleDisconnect(socket: any) {
    this.connectedSockets.delete(socket.id);
    this.streamsService.deleteMousePositionsForSocketId(socket.id);
    this.streamsService.deleteCpuLoadsForSocketId(socket.id);
    this.logger.log(`Client disconnected: ${socket.id}`);
  }
}
