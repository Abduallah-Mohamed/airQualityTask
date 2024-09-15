import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AirQualityService } from "../air-quality.service";
import { AirQuality } from "../entities/air-quality.entity";
import { FindAirQualityDto } from "../dto/find-air-quality.dto";
import { AirQualityResponse } from "../../../shared/interfaces";
import { of, throwError } from "rxjs";
import { BadRequestException } from "@nestjs/common";
import { AirVisualRepository } from "../air-visual.repository";
import { AxiosModule } from "../../../shared/axios/axios.module";

describe("AirQualityService", () => {
  let service: AirQualityService;
  let repository: Repository<AirQuality>;
  let airVisualRepository: AirVisualRepository;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    }),
  };
  const mockAirVisualRepository = {
    getAirQuality: jest.fn().mockResolvedValue({
      Result: {
        Pollution: {
          aqius: 25,
          mainus: "p2",
          aqicn: 10,
          maincn: "p1",
          ts: "2021-09-29T14:00:00.000Z",
        },
      },
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AxiosModule, ConfigModule.forRoot()], //  Include ConfigModule
      providers: [
        AirQualityService,
        {
          provide: getRepositoryToken(AirQuality),
          useValue: mockRepository,
        },
        {
          provide: AirVisualRepository,
          useValue: mockAirVisualRepository,
        },
      ],
    }).compile();
    service = module.get<AirQualityService>(AirQualityService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAirQuality", () => {
    it("should return air quality data", (done) => {
      const findAirQualityDto: FindAirQualityDto = {
        lat: 37.7749,
        lon: -122.4194,
      };
      const airQualityResponse: AirQualityResponse = {
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

      mockAirVisualRepository.getAirQuality.mockReturnValue(
        of(airQualityResponse)
      );

      service.getAirQuality(findAirQualityDto).subscribe((result) => {
        expect(result).toEqual(airQualityResponse);
        expect(mockAirVisualRepository.getAirQuality).toHaveBeenCalledWith(
          findAirQualityDto.lat,
          findAirQualityDto.lon
        );
        done();
      });
    });
  });
  describe("saveAirQualityData", () => {
    it("should save air quality data successfully", (done) => {
      const airQualityResponse: AirQualityResponse = {
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

      const savedAirQuality = new AirQuality();
      savedAirQuality.aqi = 25;
      savedAirQuality.latitude = 48.856613;
      savedAirQuality.longitude = 2.352222;

      // Mock repository methods
      mockAirVisualRepository.getAirQuality.mockReturnValue(
        of(airQualityResponse)
      );
      mockRepository.save.mockReturnValue(of(savedAirQuality));

      service.saveAirQualityData().subscribe((result) => {
        // Adjust expectations to match the returned structure
        expect(result).toEqual(
          expect.objectContaining({
            aqi: 25,
            latitude: 48.856613,
            longitude: 2.352222,
          })
        );
        expect(mockAirVisualRepository.getAirQuality).toHaveBeenCalledWith(
          48.856613,
          2.352222
        );
        expect(mockRepository.save).toHaveBeenCalledWith(
          expect.objectContaining({
            aqi: 25,
            latitude: 48.856613,
            longitude: 2.352222,
          })
        );
        done();
      });
    });
    it("should handle error while saving air quality data", (done) => {
      const errorMessage = "Failed to save air quality data";
      const airQualityResponse: AirQualityResponse = {
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

      mockAirVisualRepository.getAirQuality.mockReturnValue(
        of(airQualityResponse)
      );
      mockRepository.save.mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      service.saveAirQualityData().subscribe({
        next: () => {},
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toEqual(errorMessage);
          done();
        },
      });
    });
  });
  describe("formatMostPollutedTime", () => {
    it("should format the most polluted time data correctly", () => {
      const result: AirQuality = {
        id: 1,
        aqi: 150,
        createdAt: new Date("2021-09-29T14:00:00.000Z"),
        latitude: 48.856613,
        longitude: 2.352222,
      } as any;

      const formattedData = service.formatMostPollutedTime(result);

      expect(formattedData).toEqual({
        id: 1,
        aqi: 150,
        date: result.createdAt.toLocaleDateString(),
        time: result.createdAt.toLocaleTimeString(),
      });
    });
  });
  describe("getMostPollutedTime", () => {
    it("should return formatted most polluted time data", (done) => {
      const result: AirQuality = {
        id: 1,
        aqi: 150,
        createdAt: new Date("2021-09-29T14:00:00.000Z"),
        latitude: 48.856613,
        longitude: 2.352222,
      } as any;

      mockRepository.createQueryBuilder = jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValue(result),
        }),
      });

      service.getMostPollutedTime().subscribe((formattedResult) => {
        expect(formattedResult).toEqual({
          id: 1,
          aqi: 150,
          date: result.createdAt.toLocaleDateString(),
          time: result.createdAt.toLocaleTimeString(),
        });
        done();
      });
    });

    it("should throw BadRequestException if no data found", (done) => {
      mockRepository.createQueryBuilder = jest.fn().mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          getOne: jest.fn().mockResolvedValue(null),
        }),
      });

      service.getMostPollutedTime().subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          expect(error.message).toEqual("Failed to fetch most polluted time");
          done();
        },
      });
    });
  });
});
