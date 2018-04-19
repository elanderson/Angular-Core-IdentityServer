import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigurationService {

  private _configuration: IServerConfiguration;

  constructor(http: HttpClient) {
    http.get<IServerConfiguration>('/api/Configuration');
  }

  get apiAddress() {
    return this._configuration.ApiAddress;
  }

  get identityServerAddress() {
    return this._configuration.IdentityServerAddress;
  }

}

export interface IServerConfiguration {
  ApiAddress: string;
  IdentityServerAddress: string;
}
