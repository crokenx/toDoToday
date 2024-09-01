
import { Task, TaskStatus } from '@core/task';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireBaseService, StorageService } from '@app/services';
import { ActionSheetController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

import { config } from './folder.config';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild(config.modal.name, { static: false }) modal: any;
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  public tasks: Task[] = [];
  public categories: string[] = [];
  public categoriesFilter: string[] = [];
  public categoriesForTask: string[] = [];
  public tempCategories: string[] = [];
  public editMode: boolean = false;
  public nowShowing: string = config.showing.default;
  public canDeleteCategories: boolean = false;
  public canDeleteTask: boolean = true;

  public formTask: FormGroup = new FormGroup({
    id: new FormControl(uuidv4()),
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(TaskStatus.PENDING),
    createdAt: new FormControl(new Date()),
    updatedAt: new FormControl(new Date()),
    categories: new FormControl([]),
  });

  public formCategory: FormControl = new FormControl('');

  public presentingElement = null;

  constructor(
    private firebaseService: FireBaseService,
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async ngOnInit() {
    this.getTasks();
    this.getCategories();
    this.fetchRemoteConfig();
  }

  public getTasks(){
    this.tasks = this.storageService.getAllTasks();
    this.tasks = [...this.tasks];
  }

  public async getCategories(){
    this.categories = this.storageService.getAllCategories();
  }

  public async fetchRemoteConfig(){
    const canDelete = await this.firebaseService.fetchCanDeleteTask();
    this.canDeleteTask = canDelete;
    if(!this.canDeleteTask) this.cannotDeleteTask();
  }

  public async cannotDeleteTask(){
    const actionSheet = await this.actionSheetCtrl.create(config.cannotDeleteTask);
    actionSheet.present();
    await actionSheet.onWillDismiss();
  }

  public canDismiss = async () => {
    const task = this.formTask.value as Task;
    if(!task.title.length && !task.description.length) {
      return true;
    }
    const actionSheet = await this.actionSheetCtrl.create(config.dismissConfirmation);
    actionSheet.present();
    const { role } = await actionSheet.onWillDismiss();
    this.resetForm();
    if(role === config.deleteComparation.default){
      this.editMode = false;
      return true;
    };
    return false;
  };

  async createTask(){
    this.editMode = false;
    this.newCategoryOnCreateTask();
    this.formTask.value.categories = this.tempCategories;
    const task = this.formTask.value as Task;
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if(idx > -1) {
      this.patchTask(task, idx);
      return
    }
    this.sieveCategories();
    this.storageService.addTask(task);
    await this.storageService.saveAllTasks();
    await this.storageService.saveAllCategories();
    this.resetForm();

    this.tempCategories = [];
    this.modal && this.modal.dismiss();
    this.getTasks();
  }

  public resetForm(){
    const resetValues: Task = {
      id: uuidv4(),
      title: '',
      description: '',
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
      categories: [],
    };

    this.formTask.reset(resetValues);
  }

  async newCategoryOnCreateTask(){
    const category = this.formCategory.value;
    if(category.length === 0) return;
    const idx = this.categories.indexOf(category);
    if(idx > -1) return this.newCategoryForTask(category);
    const index = this.tempCategories.indexOf(category);
    if(index > -1) return;
    this.tempCategories.push(category);
    this.formCategory.reset('');
  }

  public newCategoryForTask(category: string){
    const idx = this.tempCategories.indexOf(category);
    if(idx > -1) return;
    this.tempCategories.push(category);
    this.formCategory.reset('');
  }

  public async patchTask(task: Task, idx: number){
    this.sieveCategories();
    this.storageService.patchTask(task, idx);
    await this.storageService.saveAllTasks();
    await this.storageService.saveAllCategories();
    this.resetForm();
    this.tempCategories = [];
    this.modal && this.modal.dismiss();
    this.getTasks();
  }

  public sieveCategories(){
    const newCategories = this.tempCategories.filter(category => !this.categories.includes(category));
    this.categories.push(...newCategories);
  }

  public async dismissModal(){
    this.editMode = false;
    this.modal && this.modal.dismiss();
    this.resetForm();
    this.formCategory.reset('');
    this.tempCategories = [];
  }

  async newCategoryOnInput(){
    const category = this.formCategory.value;
    const idx = this.categories.indexOf(category.trim());
    if(idx > -1) return;
    if(category.endsWith(' ')){
      const idx = this.tempCategories.indexOf(category.trim());
      if(idx > -1) return;
      this.tempCategories.push(category.trim());
      this.formCategory.reset('');
    }
  }

  public async addToCategoryFilter(category: string){
    if(this.canDeleteCategories) return this.deleteCategory(category);
    const idx = this.categoriesFilter.indexOf(category);
    if(idx > -1)return;
    this.categoriesFilter.push(category);
    this.categoriesFilter = [...this.categoriesFilter];
  }

  public wasDeleted(category: string){
    const idx = this.categories.indexOf(category);
    return idx === -1;
  }

  public async deleteCategory(category: string) {
    const idx = this.categories.indexOf(category);
    if(idx === -1) return;
    this.categories.splice(idx, 1);
    await this.storageService.saveAllCategories();
    this.canDeleteCategories = false;
  }

  public async deleteFromCategoryFilter(category: string){
    const idx = this.categoriesFilter.indexOf(category);
    if(idx === -1)return;
    this.categoriesFilter.splice(idx, 1);
    this.categoriesFilter = [...this.categoriesFilter];
  }

  public async deleteFromTaskCategories(category: string){
    const idx = this.tempCategories.indexOf(category);
    if(idx === -1)return;
    this.tempCategories.splice(idx, 1);
  }

  public async deleteTask(task: Task){
    const actionSheet = await this.actionSheetCtrl.create(config.deleteConfirmation);
    actionSheet.present();
    const { role } = await actionSheet.onWillDismiss();
    if(role === config.cancelComparation.default || role === config.backdropComparation.default) return;
    await this.storageService.removeTask(task);
    this.getTasks();
  }

  public async archiveTask(task: Task){
    task.status = TaskStatus.COMPLETED;
    await this.storageService.saveAllTasks();
    this.getTasks();
  }

  public async taskDone(task: Task){
    if(task.status === TaskStatus.COMPLETED){
      task.status = TaskStatus.PENDING;
    } else {
      task.status = TaskStatus.COMPLETED;
    }

    await this.storageService.saveAllTasks();
    this.getTasks();
  }

  public doneIcon(task: Task){
    return task.status === TaskStatus.PENDING;
  }

  public editTask(task: Task){
    this.editMode = true;
    this.formTask.patchValue(task);
    this.tempCategories = task.categories;
    this.editMode = true;
    this.modal && this.modal.present();
  }

  public getBadgeStyle(category: string){
    const rgba = this.getRgbaColor(category);
    const hexadecimal = this.getHexadecimalColor(category);

    return {
      'background-color': rgba,
      'border': `2px solid ${hexadecimal}`,
    }
  }

  public addCategoryToTask(category: string){
    const idx = this.tempCategories.indexOf(category);
    if(idx > -1)return;
    this.tempCategories.push(category);
    this.formCategory.reset('');
  }

  public getRgbaColor(category: string): string {
    const hash = Array.from(category).reduce((acc, char) => {
      const code = char.charCodeAt(0);
      return (acc << 5) - acc + code;
    }, 0);

    const r = (hash >> 24) & 0xFF;
    const g = (hash >> 16) & 0xFF;
    const b = (hash >> 8) & 0xFF;
    const a = (hash & 0xFF) / 255;

    return `rgba(${r}, ${g}, ${b}, ${0.5})`;
  }

  public getHexadecimalColor(category: string): string {
    const hash = Array.from(category).reduce((acc, char) => {
      const code = char.charCodeAt(0);
      return (acc << 5) - acc + code;
    }, 0);

    const hex = ((hash >> 24) & 0xFF).toString(16).padStart(2, '0') +
                ((hash >> 16) & 0xFF).toString(16).padStart(2, '0') +
                ((hash >> 8) & 0xFF).toString(16).padStart(2, '0') +
                (hash & 0xFF).toString(16).padStart(2, '0');

    return `#${hex.toUpperCase().substring(0, 6)}`;
  }
}
