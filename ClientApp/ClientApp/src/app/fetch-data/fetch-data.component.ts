import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ConfigurationService } from "../configuration/configuration.service";

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];

  constructor(authService: AuthService, configuration: ConfigurationService) {
    authService.get(configuration.apiAddress + 'SampleData/WeatherForecasts').subscribe(result => {
      this.forecasts = result as WeatherForecast[];
    }, error => console.error(error));
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
