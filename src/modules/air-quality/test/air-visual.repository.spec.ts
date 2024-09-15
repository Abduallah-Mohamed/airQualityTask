import { Test, TestingModule } from "@nestjs/testing";
import { AirVisualRepository } from "../air-visual.repository";
import { AxiosService } from "../../../shared/axios/axios.service";
import { Logger } from "@nestjs/common";
import { of } from "rxjs";
import { AxiosResponse } from "axios";
import { ConfigService } from "@nestjs/config";

describe("AirVisualRepository", () => {
  let repository: AirVisualRepository;
  let axiosService: AxiosService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirVisualRepository,
        Logger,
        {
          provide: AxiosService,
          useValue: {
            httpClient: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => ({
              api: {
                key: "test-api-key",
              },
            })),
          },
        },
      ],
    }).compile();

    repository = module.get<AirVisualRepository>(AirVisualRepository);
    axiosService = module.get<AxiosService>(AxiosService);
  });

  it("should be defined", () => {
    expect(repository).toBeDefined();
  });

  describe("getAirQuality", () => {
    const lat = 37.7749;
    const lon = -122.4194;
    const pollutionData = {
      aqius: 25,
      mainus: "p2",
      aqicn: 10,
      maincn: "p1",
      ts: "2021-09-29T14:00:00.000Z",
    };

    it("should return air quality data", (done) => {
      const response = {
        data: { data: { current: { pollution: pollutionData } } },
        status: 200,
        statusText: "OK",
        headers: {},
      };

      jest
        .spyOn(axiosService.httpClient, "get")
        .mockReturnValue(of(response as AxiosResponse));

      repository.getAirQuality(lat, lon).subscribe((result) => {
        expect(result).toEqual({ Result: { Pollution: pollutionData } });
        done();
      });
    });
  });
});
