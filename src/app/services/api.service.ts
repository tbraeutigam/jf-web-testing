import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Dependent Services
import { ConfigService } from './config.service';


@Injectable({
  providedIn: 'root'
})

export class ApiService {

  apiURL: string = this.configService.getServer();
  apiKey: string = `?api_key=${this.configService.getApiKey()}`;

  constructor(private httpClient: HttpClient,
    private configService: ConfigService) {}

  public getUserLibraries(user: string){
    return this.httpClient.get(`${this.apiURL}/Users/${user}/Views${this.apiKey}`);
  }

  public getItems(user: string, itemType?: string, fields?: string[], options?: {}){
    let URI = `/Users/${user}/Items${this.apiKey}`;

    if (itemType && itemType != '' ) URI += `&IncludeItemTypes=${itemType}`;
    URI += `&Fields=${fields.join(',')}`

    if (options) {
      for (let o in options){
        URI += `&${o}=${options[o]}`
      }
    }
    return this.httpClient.get(`${this.apiURL}${URI}`);
  }

  public getItem(user: string, itemId: any){
    return this.httpClient.get(`${this.apiURL}/Users/${user}/Items/${itemId}${this.apiKey}`);
  }

  public getChildren(user: string, itemId: any, recursive: string){
    return this.httpClient.get(`${this.apiURL}/Users/${user}/Items${this.apiKey}&ParentId=${itemId}&Recursive=${recursive}`)
  }
}
