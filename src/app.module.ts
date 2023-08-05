// app.module.ts

import { Module } from '@nestjs/common';
import { StreamsGateway } from './streams/streams.gateway';
import { StreamsService } from './streams/streams.service';

@Module({
  providers: [StreamsGateway, StreamsService],
})
export class AppModule {}
