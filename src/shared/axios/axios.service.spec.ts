import { Test, TestingModule } from '@nestjs/testing';
import { AxiosService } from './axios.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('AxiosService', () => {
  let service: AxiosService;
  let httpService: HttpService;
  let logger: Logger;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AxiosService,
        HttpService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'http://api.example.com'),
          },
        },
        {
          provide: Logger,

          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              defaults: {},
              interceptors: {
                request: { use: jest.fn() },
                response: { use: jest.fn() },
              },
            },
          },
        },
      ],
    }).compile();

    service = module.get<AxiosService>(AxiosService);
    httpService = module.get<HttpService>(HttpService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set base URL on initialization', () => {
    expect(logger.log).toHaveBeenCalledWith('API_URL: http://api.example.com');
    expect(logger.log).toHaveBeenCalledWith('Setting new base URL: http://api.example.com');
    expect(httpService.axiosRef.defaults.baseURL).toBe('http://api.example.com');
  });

  it('should log request details in request interceptor', () => {
    const config = {
      method: 'get',
      url: '/test',
      data: { key: 'value' },
      headers: { 'Content-Type': 'application/json' },
    };
    const interceptor = (httpService.axiosRef.interceptors.request.use as jest.Mock).mock
      .calls[0][0];

    interceptor(config);
    expect(logger.log).toHaveBeenCalledWith(
      `Request - Method: get, URL: /test, Data: {"key":"value"}, Headers: {"Content-Type":"application/json"}`,
    );
  });

  it("should log response details in response interceptor", () => {
    const response = {
      status: 200,
      statusText: "OK",
      data: { key: "value" },
    };
    const interceptor = (
      httpService.axiosRef.interceptors.response.use as jest.Mock
    ).mock.calls[0][0];

    interceptor(response);
    expect(logger.log).toHaveBeenCalledWith(
      `Response - Status: 200, StatusText: OK, Data: {"key":"value"}`
    );
  });

  it("should log request error in request interceptor", async () => {
    const error = new Error("Request error");
    const interceptor = (
      httpService.axiosRef.interceptors.request.use as jest.Mock
    ).mock.calls[0][1];

    await expect(async ()=>interceptor(error)).rejects.toThrow(error)

    expect(logger.error).toHaveBeenCalledWith(
      "Request error: Request error",
      error.stack
    );
  });

  it("should log response error in response interceptor", async () => {
    const error = {
      response: {
        status: 500,
        statusText: "Internal Server Error",
        data: { message: "Error" },
      },
      message: "Response error",
      stack: "stack trace",
    };
    const interceptor = (
      httpService.axiosRef.interceptors.response.use as jest.Mock
    ).mock.calls[0][1];

    await expect(async ()=>interceptor(error)).rejects.toThrow(new Error(error as any))

    expect(logger.error).toHaveBeenCalledWith(
     'Response error - Status: 500, StatusText: Internal Server Error, Data: {"message":"Error"}'
    );
  });
});
