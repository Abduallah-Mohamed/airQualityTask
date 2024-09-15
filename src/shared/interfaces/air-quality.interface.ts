export interface Pollution {
  ts: string;
  aqius: number;
  mainus: string;
  aqicn: number;
  maincn: string;
}

export interface Result {
  Pollution: Pollution;
}

export interface AirQualityResponse {
  Result: Result;
}

export interface AirQualityMostPollutedTime {
  id: number;
  aqi: number;
  date: string;
  time: string;
}
