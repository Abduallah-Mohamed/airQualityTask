# Air Quality Monitoring Application - Documentation

## Overview

This application is a NestJS-based system designed to monitor air quality across different locations. It fetches air quality data from external APIs, stores it in a database, and provides endpoints for querying this data. Additionally, it includes a scheduled job to regularly update air quality data and a set of utility modules and interceptors to support the application's operations.

## Project Structure

The project is organized into a `src` folder, which contains the main components of the application. Below is an overview of the folder structure:

src/ ├── modules/ │ ├── air-quality/ │ │ ├── dto/ │ │ ├── entities/ │ │ ├── test/ │ │ ├── air-quality.controller.ts │ │ ├── air-quality.service.ts │ │ ├── air-quality.module.ts │ │ ├── air-visual.repository.ts │ │ ├── scheduler/ │ │ │ └── air-quality-cron.service.ts ├── shared/ │ ├── axios/ │ ├── config/ │ ├── database/ │ ├── interceptors/ │ ├── interfaces/ │ └── index.ts └── main.ts

### Modules

#### Air Quality Module

This module handles all operations related to air quality, including fetching, saving, and querying air quality data.

- **Entities**

  - `AirQuality`: Defines the `AirQuality` entity, representing air quality data stored in the database.
    - Fields include `id`, `aqi`, `latitude`, `longitude`, and `createdAt`.

- **Services**

  - `AirQualityService`: Contains the core business logic for fetching and saving air quality data.
    - Key methods:
      - `getAirQuality()`: Fetches air quality data for a given latitude and longitude.
      - `saveAirQualityData()`: Saves air quality data for a predefined location.
      - `getMostPollutedTime()`: Retrieves the time when the air quality was most polluted.
      - `formatMostPollutedTime()`: Formats the most polluted time data.

- **Repositories**

  - `AirVisualRepository`: Responsible for interacting with external APIs to fetch air quality data.
    - Key method:
      - `getAirQuality(lat, lon)`: Fetches air quality data for given coordinates.

- **Controllers**

  - `AirQualityController`: Exposes REST API endpoints for interacting with the air quality data.
    - Endpoints:
      - `GET /air-quality/nearest-city`: Fetches air quality data for the nearest city based on provided coordinates.
      - `GET /air-quality/most-polluted-time`: Retrieves the time when the air quality was most polluted.

- **Schedulers**

  - `AirQualityCronService`: Contains logic for periodically fetching and saving air quality data.
    - Cron Job: Runs every 10 hours to fetch and save air quality data.

- **DTOs**
  - `FindAirQualityDto`: Data Transfer Object for fetching air quality information based on latitude and longitude.
  - `CreateAirQualityDto`: Data Transfer Object for creating an `AirQuality` entity.

#### Shared Module

This module contains reusable services, configurations, and interceptors used across the application.

- **AxiosService**

  - Provides a centralized service for making HTTP requests using Axios, with request and response interceptors for logging and error handling.

- **ConfigModule**

  - Manages application configuration using environment variables.

- **DatabaseModule**

  - Configures and sets up TypeORM for database operations, supporting MySQL.

- **Interceptors**

  - `GlobalExceptionInterceptor`: A global interceptor to handle and log exceptions occurring within the application.

- **Interfaces**
  - Defines shared TypeScript interfaces used across the application, such as `AirQualityResponse` and `AirQualityMostPollutedTime`.

## Running the Application

1. **Install Dependencies**:
   yarn or npm install

2. **Set Up Environment Variables**:

- Create a `.env` file at the root of the project with the following variables:
  ```
  DATABASE_HOST=your_database_host
  DATABASE_PORT=your_database_port
  DATABASE_USER=your_database_user
  DATABASE_PASSWORD=your_database_password
  DATABASE_NAME=your_database_name
  API_URL=your_api_url
  API_KEY=your_api_key
  PORT=3000
  ```

4. **Start the Application**:

- npm run start, yarn start

5. **Access Swagger Documentation**:

- You can view the API documentation via Swagger by navigating to `http://localhost:3000/api` in your browser.

6. **Run Tests**:

- You can run the tests using the following command in the root directory of the application:
  ```
  yarn test
  ```

## API Endpoints

- **GET /air-quality/nearest-city**
- Fetches the air quality data for the nearest city based on provided coordinates.

- **GET /air-quality/most-polluted-time**
- Retrieves the time when the air quality was most polluted.

## Scheduled Jobs

- **AirQualityCronService**
- Runs every 10 hours to fetch and save air quality data for a predefined location.

## Error Handling

- **GlobalExceptionInterceptor**
- Catches and logs all exceptions, returning a consistent error structure in the response.

## Test Coverage

The image below represents the visual test coverage for the project, which is almost 100%.

![Visual Test Coverage](https://drive.google.com/uc?id=1j8k4v-8DFNDbznh3DKSjAIBd6CgttrFg "Visual Test Coverage")

As you can see, the coverage is comprehensive, ensuring that almost all aspects of the codebase are tested effectively.

## Conclusion

This documentation provides an overview of the Air Quality Monitoring Application, detailing the project structure, key components, and usage instructions. This should serve as a reference for developers working on or maintaining the application.
