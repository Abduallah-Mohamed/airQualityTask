import { IsDecimal, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class FindAirQualityDto {
  @ApiProperty({
    description: "Latitude of the location",
    example: 37.7749,
  })
  @IsNotEmpty()
  @IsDecimal()
  lat: number;

  @ApiProperty({
    description: "Longitude of the location",
    example: -122.4194,
  })
  @IsNotEmpty()
  @IsDecimal()
  lon: number;
}
