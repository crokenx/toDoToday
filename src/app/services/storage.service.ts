import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage!: Storage;

  constructor(private storage: Storage) {
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any) {
    await this._storage.set(key, value);
  }

  public get(key: string) {
    return this._storage?.get(key);
  }

  public getKeys() {
    return this._storage?.keys();
  }
}
