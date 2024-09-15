import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAirQualityDto {
  @ApiProperty({
    description: "Air Quality Index",
    example: 150,
  })
  @IsNumber()
  aqi: number;

  @ApiProperty({
    description: "Latitude of the location",
    example: 37.7749,
  })
  @IsNumber()
  latitude: number;

  @ApiProperty({
    description: "Longitude of the location",
    example: -122.4194,
  })
  @IsNumber()
  longitude: number;
}
