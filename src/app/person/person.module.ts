import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonRoutingModule } from './person-routing.module';
import { PersonListComponent } from './list/person-list.component';
import { PersonEditComponent } from './edit/person-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from '../common/search/search.module';

@NgModule({
  declarations: [PersonListComponent, PersonEditComponent],
  imports: [CommonModule, PersonRoutingModule, FormsModule, SearchModule, ReactiveFormsModule],
})
export class PersonModule {}
