import { Controller, Get, Query } from "@nestjs/common";
import { AirQualityService } from "./air-quality.service";
import { FindAirQualityDto } from "./dto/find-air-quality.dto";

@Controller("air-quality")
export class AirQualityController {
  constructor(private readonly airQualityService: AirQualityService) {}

  @Get("nearest-city")
  getNearestCity(@Query() FindAirQualityDto: FindAirQualityDto) {
    return this.airQualityService.getAirQuality(FindAirQualityDto);
  }

  @Get("most-polluted-time")
  async getMostPollutedTime() {
    return this.airQualityService.getMostPollutedTime();
  }
}
