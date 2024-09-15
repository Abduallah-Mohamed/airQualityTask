import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AxiosResponse } from "axios";
import { AxiosService } from "../../shared/axios/axios.service";
import { AirQualityResponse } from "@/shared/interfaces";

@Injectable()
export class AirVisualRepository {
  private readonly logger = new Logger(AirVisualRepository.name);

  constructor(
    private axiosService: AxiosService,

    private configService: ConfigService
  ) {}

  getAirQuality(lat: number, lon: number): Observable<AirQualityResponse> {
    return this.axiosService.httpClient
      .get("", {
        params: {
          lat,
          lon,
          key: this.configService.get("api.key"),
        },
      })
      .pipe(
        map((response: AxiosResponse) => {
          const pollution = response.data.data.current.pollution;
          return { Result: { Pollution: pollution } };
        }),
        catchError((error) => {
          this.logger.error("Error fetching nearest city:", error);
          throw new BadRequestException("Failed to fetch nearest city");
        })
      );
  }
}
