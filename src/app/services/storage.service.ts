import { Injectable, OnDestroy } from '@angular/core';

import { Storage } from '@ionic/storage-angular';

import { Task, TaskStatus } from '@core/task';

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
    this.tasks = await this._storage.get('tasks') || [];
    this.categories = await this._storage.get('categories') || [];
    console.log("categories ", this.categories)
  }

  public async addTask(task: Task) {
    this.tasks.push(task);
  }

  public async addCategory(category: string) {
    this.categories.push(category);
  }

  public async removeTask(task: Task) {
    const toRemove = task.title
    this.tasks = this.tasks.filter(task => task.title !== toRemove);
    await this.saveAllTasks();
  }

  public getAllTasks() {
    return this.tasks;
  }

  public getAllCategories() {
    return this.categories;
  }

  async saveAllTasks() {
    console.log("edited tasks in storage ", this.tasks)
      await this._storage?.set('tasks', this.tasks);
  }

  public patchTask(task: Task, idx: number) {
    this.tasks[idx] = task;
  }

  async saveAllCategories() {
    await this._storage?.set('categories', this.categories);
  }

  async clearStorage() {
    await this._storage?.clear();
  }
}
