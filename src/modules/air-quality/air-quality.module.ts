import { Module } from "@nestjs/common";
import { AirQualityService } from "./air-quality.service";
import { AirQualityController } from "./air-quality.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AirQuality } from "./entities/air-quality.entity";
import { AxiosModule } from "@/shared/axios/axios.module";
import { AirVisualRepository } from "./air-visual.repository";
import { SchedulerService } from './scheduler/scheduler.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirQuality]), AxiosModule],
  controllers: [AirQualityController],
  providers: [AirQualityService, AirVisualRepository, SchedulerService],
})
export class AirQualityModule {}
