import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

@Injectable()
export class AxiosService {
  constructor(
    public httpClient: HttpService,
    public logger: Logger,
    configService: ConfigService
  ) {
    const apiUrl = configService.get<string>("api.url");
    this.logger.log(`API_URL: ${apiUrl}`);
    this.setBaseUrl(apiUrl);
    this.setupRequestInterceptor();
    this.setupResponseInterceptor();
  }

  // Method to set the base URL for axios
  setBaseUrl(url: string) {
    this.logger.log(`Setting new base URL: ${url}`);
    this.httpClient.axiosRef.defaults.baseURL = url;
  }

  // Method to set up the request interceptor
  private setupRequestInterceptor() {
    this.httpClient.axiosRef.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const { method, url, data, headers } = config;
        this.logger.log(
          `Request - Method: ${method}, URL: ${url}, Data: ${JSON.stringify(data)}, Headers: ${JSON.stringify(headers)}`
        );
        return config;
      },
      (error) => {
        this.logger.error(`Request error: ${error.message}`, error.stack);
        return Promise.reject(
          error instanceof Error ? error : new Error(error)
        );
      }
    );
  }

  // Method to set up the response interceptor
  private setupResponseInterceptor() {
    this.httpClient.axiosRef.interceptors.response.use(
      (response: AxiosResponse) => {
        const { status, statusText, data } = response;
        this.logger.log(
          `Response - Status: ${status}, StatusText: ${statusText}, Data: ${JSON.stringify(data)}`
        );
        return response;
      },
      (error) => {
        if (error.response) {
          const { status, statusText, data } = error.response;
          this.logger.error(
            `Response error - Status: ${status}, StatusText: ${statusText}, Data: ${JSON.stringify(data)}`
          );
        } else {
          this.logger.error(`Response error: ${error.message}`, error.stack);
        }
        return Promise.reject(
          error instanceof Error ? error : new Error(error)
        );
      }
    );
  }
}
