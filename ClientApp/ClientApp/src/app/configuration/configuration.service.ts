import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigurationService {

  private configuration: IServerConfiguration;

  constructor(http: HttpClient) {
    console.log("1");
    http.get<IServerConfiguration>('/api/Configuration/ConfigurationData')
      .subscribe(result => {
        console.log(result);
        this.configuration = result;
      }, error => console.error(error));
    console.log("2");
    console.log(this.configuration);
  }

  get apiAddress() {
    return this.configuration.apiAddress;
  }

  get identityServerAddress() {
    return this.configuration.identityServerAddress;
  }

}

export interface IServerConfiguration {
  apiAddress: string;
  identityServerAddress: string;
}
