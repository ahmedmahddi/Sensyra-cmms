import { Module } from '@nestjs/common';
import { PMSchedulesService } from './pm-schedules.service';
import { PMSchedulesController } from './pm-schedules.controller';

@Module({
  controllers: [PMSchedulesController],
  providers: [PMSchedulesService],
  exports: [PMSchedulesService],
})
export class PMSchedulesModule {}
