// app.module.ts

import { Module } from '@nestjs/common';
import { StreamsGateway } from './streams/streams.gateway';
import { StreamsService } from './streams/streams.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [StreamsGateway, StreamsService],
})
export class AppModule {}
