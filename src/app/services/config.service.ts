import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  getServer(){
    let fqdn = 'jellyfin'
    return `http://${fqdn}:8096/emby`;
  }

  getUser(){
    return '5a613f8ab43645bc8f24b4443b11c94a';
  }

  getApiKey(){
    return '01d6c7d6d21b45268362b2b3d12646cd';
  }

  constructor() { }
}
