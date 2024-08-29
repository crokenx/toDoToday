import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from "firebase/app";
import { fetchAndActivate, getRemoteConfig, RemoteConfig, getValue, fetchConfig } from "firebase/remote-config";
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FireBaseService {

  private fireBaseApp!: FirebaseApp;
  private remoteConfig!: RemoteConfig;

  constructor() {
  }

  public async init(){
    this.fireBaseApp = initializeApp(environment.firebaseConfig);
    await this.getRemoteConfig();
  }

  public async getRemoteConfig(){
    this.remoteConfig = getRemoteConfig(this.fireBaseApp);
    this.remoteConfig.settings.minimumFetchIntervalMillis = 10;
    await fetchAndActivate(this.remoteConfig)
  }

  public async fetchValue(){
    const response = getValue(this.remoteConfig, "welcome");
    const response2 = getValue(this.remoteConfig, "message");
    console.log(response, response2)
  }
}
