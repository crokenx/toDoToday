import { Task, TaskStatus } from '@core/task';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FireBaseService, StorageService } from '@app/services';
import { ActionSheetController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  @ViewChild('modal', { static: false }) modal: any;
  @ViewChild('modalEdit') modalEdit: any;
  public folder!: string;
  private activatedRoute = inject(ActivatedRoute);
  public tasks: Task[] = [];
  public categories: string[] = [];
  public categoriesFilter: string[] = [];
  public categoriesForTask: string[] = [];

  public formTask: FormGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl(TaskStatus.PENDING),
    createdAt: new FormControl(new Date()),
    updatedAt: new FormControl(new Date()),
    categories: new FormControl([]),
  });

  public formCategory: FormControl = new FormControl('');

  public resetValues: Task = {
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
    categories: [],
  }

  public appPages = [
    { title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
  ];

  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  presentingElement = null;

  constructor(
    private firebaseService: FireBaseService,
    private storageService: StorageService,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async ngOnInit() {
    this.folder = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.getTasks();
    this.getCategories();
  }

  public getTasks(){
    this.tasks = this.storageService.getAllTasks();
  }

  public async getCategories(){
    this.categories = this.storageService.getAllCategories();
  }

  public async fetchValue(){
    this.firebaseService.fetchValue();
  }

  canDismiss = async () => {

    const task = this.formTask.value as Task;

    if(!task.title.length && !task.description.length) {
      return true;
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Perderas la tarea, deseas salir de todos modos?',
      buttons: [
        {
          text: 'Si',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    this.formTask.reset(this.resetValues);

    if(role === 'confirm'){
      return true;
    };
    return false;
  };

  async createTask(){
    const task = this.formTask.value as Task;
    this.storageService.addTask(task);
    await this.storageService.saveAllTasks();
    await this.storageService.saveAllCategories();
    this.formTask.reset(this.resetValues);
    this.modal && this.modal.dismiss();
  }

  public async dismissModal(){
    this.modal && this.modal.dismiss();
    this.formTask.reset(this.resetValues);
  }

  async newCategoryOnInput(){
    const category = this.formCategory.value;
    const idx = this.categories.indexOf(category.trim());

    if(idx > -1) return;

    if(category.endsWith(' ')){
      this.categories.push(category.trim());
      this.formCategory.reset('');
    }
  }

  async newCategoryFocusOut(){
    const category = this.formCategory.value
    const idx = this.categories.indexOf(category);
    if(!category.length) return;
    this.categories.push(category.trim());
    this.formCategory.reset('');
  }

  public async addToCategoryFilter(category: string){
    const idx = this.categoriesFilter.indexOf(category);
    if(idx > -1)return;
    this.categoriesFilter.push(category);
    this.categoriesFilter = [...this.categoriesFilter];
  }

  public async deleteFromCategoryFilter(category: string){
    const idx = this.categoriesFilter.indexOf(category);
    if(idx === -1)return;
    this.categoriesFilter.splice(idx, 1);
    this.categoriesFilter = [...this.categoriesFilter];
  }

  getBadgeStyle(category: string){
    const rgba = this.getRgbaColor(category);
    const hexadecimal = this.getHexadecimalColor(category);

    return {
      'background-color': rgba,
      'border': `2px solid ${hexadecimal}`,
    }
  }

  public addCategoryToTask(category: string){
    this.formTask.value.categories.push(category);
    console.log('add category', this.formTask.value)
  }

  getRgbaColor(category: string): string {
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

  getHexadecimalColor(category: string): string {
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
