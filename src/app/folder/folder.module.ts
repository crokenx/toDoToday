import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';
import { ErrorComponent } from '@app/components/error/error.component';
import { FilterPipe } from '@app/pipes';
import { FilterTasksPipe } from '@app/pipes';
import { FilterCompletedPipe } from '@app/pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    ReactiveFormsModule,
    FilterPipe,
    FilterTasksPipe,
    FilterCompletedPipe
  ],
  declarations: [FolderPage, ErrorComponent]
})
export class FolderPageModule {}
