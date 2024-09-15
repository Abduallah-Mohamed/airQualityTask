import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { from, Observable } from "rxjs";
import { map, catchError, first, switchMap, tap } from "rxjs/operators";
import { InjectRepository } from "@nestjs/typeorm";
import { AirQuality } from "./entities/air-quality.entity";
import { Repository } from "typeorm";
import {
  AirQualityMostPollutedTime,
  AirQualityResponse,
} from "../../shared/interfaces";
import { AirVisualRepository } from "./air-visual.repository";
import { FindAirQualityDto } from "./dto/find-air-quality.dto";
import { CreateAirQualityDto } from "./dto/create-air-quality.dto";

@Injectable()
export class AirQualityService {
  private readonly logger = new Logger(AirQualityService.name);

  constructor(
    private AirVisualRepository: AirVisualRepository,
    @InjectRepository(AirQuality)
    private readonly airQualityRepository: Repository<AirQuality>
  ) {}

  /**
   * Fetches air quality data for the given latitude and longitude.
   * @param lat - Latitude of the location.
   * @param lon - Longitude of the location.
   * @returns An observable of AirQualityResponse containing air quality data.
   */
  getAirQuality({
    lat,
    lon,
  }: FindAirQualityDto): Observable<AirQualityResponse> {
    return this.AirVisualRepository.getAirQuality(lat, lon);
  }

  /**
   * Saves air quality data for a predefined location (Paris, France).
   * @returns An observable of the saved AirQuality entity.
   */
  saveAirQualityData(): Observable<AirQuality> {
    const payload: FindAirQualityDto = { lat: 48.856613, lon: 2.352222 }; // Coordinates for Paris, France
    return from(this.getAirQuality(payload)).pipe(
      first(), // Take the first emitted value and complete
      tap((data) => this.logger.log("Air quality data fetched:", data)),
      switchMap((data) => {
        // Transform the API response to CreateAirQualityDto
        const airQualityDto: CreateAirQualityDto = {
          aqi: data.Result.Pollution.aqius,
          latitude: 48.856613,
          longitude: 2.352222,
        };
        const airQuality = new AirQuality();
        Object.assign(airQuality, airQualityDto); // Assign DTO properties to the AirQuality entity
        return from(this.airQualityRepository.save(airQuality)).pipe(
          map(() => airQuality) // Return the saved entity
        );
      }),
      tap((airQuality) =>
        this.logger.log("Air quality data saved:", airQuality)
      ),
      catchError((error) => {
        this.logger.error("Error saving air quality data:", error);
        throw new BadRequestException("Failed to save air quality data");
      })
    );
  }

  /**
   * Retrieves the time when the air quality was most polluted.
   * @returns An observable of AirQualityMostPollutedTime containing the most polluted time data.
   */
  getMostPollutedTime(): Observable<AirQualityMostPollutedTime> {
    return from(
      this.airQualityRepository
        .createQueryBuilder("air_quality")
        .orderBy("air_quality.aqi", "DESC")
        .getOne()
    ).pipe(
      map((result) => {
        if (!result) {
          this.logger.log("No air quality data found.");
          throw new BadRequestException("No air quality data found");
        }
        return this.formatMostPollutedTime(result); // Format the result
      }),
      catchError((error) => {
        this.logger.error("Error fetching most polluted time:", error);
        throw new BadRequestException("Failed to fetch most polluted time");
      })
    );
  }

  /**
   * Formats the most polluted time data.
   * @param result - The AirQuality entity with the highest AQI.
   * @returns An object containing the formatted most polluted time data.
   */
  formatMostPollutedTime(result: AirQuality): AirQualityMostPollutedTime {
    const mostPollutedTime = new Date(result.createdAt);
    const formattedDate = mostPollutedTime.toLocaleDateString(); // Format the date
    const formattedTime = mostPollutedTime.toLocaleTimeString(); // Format the time

    this.logger.log(`Most polluted time: ${formattedDate} ${formattedTime}`);

    return {
      id: result.id,
      aqi: result.aqi,
      date: formattedDate,
      time: formattedTime,
    };
  }
}
