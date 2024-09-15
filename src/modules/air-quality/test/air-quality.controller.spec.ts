import { Test, TestingModule } from "@nestjs/testing";
import { AirQualityController } from "../air-quality.controller";
import { AirQualityService } from "../air-quality.service";
import { HttpModule } from "@nestjs/axios";
import * as request from "supertest";
import { INestApplication, Logger, BadRequestException } from "@nestjs/common";
import { of, throwError } from "rxjs";

describe("AirQualityController", () => {
  let app: INestApplication;
  let airQualityService: AirQualityService;
  let logger: Logger;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [AirQualityController],
      providers: [
        {
          provide: AirQualityService,
          useValue: {
            getAirQuality: jest.fn(),
            getMostPollutedTime: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
    logger = moduleRef.get<Logger>(Logger);

    airQualityService = moduleRef.get<AirQualityService>(AirQualityService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe("GET /air-quality/nearest-city", () => {
    it("should return air quality data", async () => {
      const findAirQualityDto = { lat: 37.7749, lon: -122.4194 };
      const airQualityResponse = {
        Result: {
          Pollution: {
            aqius: 25,
            mainus: "p2",
            aqicn: 10,
            maincn: "p1",
            ts: "2021-09-29T14:00:00.000Z",
          },
        },
      };

      jest
        .spyOn(airQualityService, "getAirQuality")
        .mockReturnValue(of(airQualityResponse));

      const response = await request(app.getHttpServer())
        .get("/air-quality/nearest-city")
        .query(findAirQualityDto)
        .expect(200);

      expect(response.body).toEqual(airQualityResponse);
    });

    it("should handle errors from getAirQuality", async () => {
      jest
        .spyOn(airQualityService, "getAirQuality")
        .mockReturnValue(throwError(() => new Error("Service error")));

      const findAirQualityDto = { lat: 37.7749, lon: -122.4194 };

      await request(app.getHttpServer())
        .get("/air-quality/nearest-city")
        .query(findAirQualityDto)
        .expect(500); // or the appropriate status code for internal errors
    });
  });

  describe("GET /air-quality/most-polluted-time", () => {
    it("should return most polluted time data", async () => {
      const mostPollutedTimeResponse = {
        id: 1,
        aqi: 25,
        date: "2021-09-29",
        time: "14:00:00",
      };

      jest
        .spyOn(airQualityService, "getMostPollutedTime")
        .mockReturnValue(of(mostPollutedTimeResponse));

      const response = await request(app.getHttpServer())
        .get("/air-quality/most-polluted-time")
        .expect(200);

      expect(response.body).toEqual(mostPollutedTimeResponse);
    });

    it("should handle errors from getMostPollutedTime", async () => {
      jest
        .spyOn(airQualityService, "getMostPollutedTime")
        .mockReturnValue(throwError(() => new Error("Service error")));

      await request(app.getHttpServer())
        .get("/air-quality/most-polluted-time")
        .expect(500); // or the appropriate status code for internal errors
    });

    it("should handle no data found for most polluted time", async () => {
      jest
        .spyOn(airQualityService, "getMostPollutedTime")
        .mockReturnValue(
          throwError(() => new BadRequestException("No data found"))
        );

      await request(app.getHttpServer())
        .get("/air-quality/most-polluted-time")
        .expect(400); // or the appropriate status code for bad request
    });
  });
});
