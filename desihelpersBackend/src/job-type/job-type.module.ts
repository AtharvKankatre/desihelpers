import { Module } from '@nestjs/common';
import { JobTypeController } from './job-type.controller';

@Module({
  controllers: [JobTypeController],
  providers: [],
})
export class JobTypeModule {}
