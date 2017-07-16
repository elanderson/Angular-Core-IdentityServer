import { Component, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'fetchdata',
    templateUrl: './fetchdata.component.html'
})
export class FetchDataComponent {
    public forecasts: WeatherForecast[];

    constructor(http: Http, @Inject('API_URL') apiUrl: string, authService: AuthService) {
        authService.AuthGet(apiUrl + 'SampleData/WeatherForecasts').subscribe(result => {
            this.forecasts = result.json() as WeatherForecast[];
        });
    }
}

interface WeatherForecast {
    dateFormatted: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}
