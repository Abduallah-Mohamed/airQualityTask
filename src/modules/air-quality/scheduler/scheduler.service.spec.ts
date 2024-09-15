import { Test, TestingModule } from "@nestjs/testing";
import { SchedulerService } from "./scheduler.service";
import { AirQualityService } from "../air-quality.service";
import { Logger } from "@nestjs/common";
import { of, throwError } from "rxjs";
import { AirQuality } from "../entities/air-quality.entity";

describe("SchedulerService", () => {
  let schedulerService: SchedulerService;
  let airQualityService: AirQualityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchedulerService,
        {
          provide: AirQualityService,
          useValue: {
            saveAirQualityData: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    schedulerService = module.get<SchedulerService>(SchedulerService);
    airQualityService = module.get<AirQualityService>(AirQualityService);
  });

  it("should be defined", () => {
    expect(schedulerService).toBeDefined();
  });

  it("should log air quality data saved successfully", async () => {
    const mockData: AirQuality = {
      id: 1,
      aqi: 50,
      latitude: 0,
      longitude: 0,
      createdAt: new Date(),
    };
    jest
      .spyOn(airQualityService, "saveAirQualityData")
      .mockReturnValue(of(mockData));
    const loggerSpy = jest.spyOn(schedulerService["logger"], "log");

    await schedulerService.handleCron();

    expect(loggerSpy).toHaveBeenCalledWith("Air quality data saved:", mockData);
  });

  it("should log an error if saving air quality data fails", async () => {
    const mockError = new Error("Test error");
    jest
      .spyOn(airQualityService, "saveAirQualityData")
      .mockReturnValue(throwError(mockError));
    const loggerSpy = jest.spyOn(schedulerService["logger"], "error");

    await schedulerService.handleCron();

    expect(loggerSpy).toHaveBeenCalledWith(
      "Error checking and saving air quality:",
      mockError
    );
  });
});
