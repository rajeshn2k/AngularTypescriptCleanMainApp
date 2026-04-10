import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { BookListComponent } from './list/book-list.component';
import { BookEditComponent } from './edit/book-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchModule } from '../common/search/search.module';

@NgModule({
  declarations: [BookListComponent, BookEditComponent],
  imports: [CommonModule, BookRoutingModule, FormsModule, SearchModule, ReactiveFormsModule],
})
export class BookModule {}
