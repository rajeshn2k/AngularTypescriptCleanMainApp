import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonListComponent } from './list/person-list.component';
import { PersonEditComponent } from './edit/person-edit.component';

const routes: Routes = [
  {
    path: '',
    component: PersonListComponent,
  },
  {
    path: 'edit/:id',
    component: PersonEditComponent,
  },
  {
    path: 'edit',
    component: PersonEditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonRoutingModule {}
