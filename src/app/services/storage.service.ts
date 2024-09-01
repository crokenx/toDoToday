import { Injectable, OnDestroy } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { Task, TaskStatus } from '@core/task';

import { config } from './config.storage'

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage!: Storage;
  public tasks: Task[] = [];
  public categories: string[] = [];

  constructor(private storage: Storage) {
  }

  async init() {
    this._storage = await this.storage.create();
    this.tasks = await this._storage.get(config.storageTaskKey) || [];
    this.categories = await this._storage.get(config.storageCategoriesKey) || [];
  }

  public async addTask(task: Task) {
    this.tasks.push(task);
  }

  public async addCategory(category: string) {
    this.categories.push(category);
  }

  public async removeTask(task: Task) {
    const toRemove = task.id
    this.tasks = this.tasks.filter(task => task.id !== toRemove);
    await this.saveAllTasks();
  }

  public getAllTasks() {
    return this.tasks;
  }

  public getAllCategories() {
    return this.categories;
  }

  async saveAllTasks() {
      await this._storage?.set(config.storageTaskKey, this.tasks);
  }

  public patchTask(task: Task, idx: number) {
    this.tasks[idx] = task;
  }

  async saveAllCategories() {
    await this._storage?.set(config.storageCategoriesKey, this.categories);
  }

  async clearStorage() {
    await this._storage?.clear();
  }
}
