import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Person } from '../../common/model/person';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageAction } from '../../common/constant/page-action';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { format } from 'date-fns'
import { PersonApiService } from '../service/person-api.service';

@Component({
  selector: 'app-person-edit',
  templateUrl: './person-edit.component.html',
  styleUrl: './person-edit.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PersonEditComponent
  implements OnInit, OnDestroy
{
  private getPersonByPersonIdSubscription!: Subscription;
  private editPersonSubscription!: Subscription;
  private addPersonSubscription!: Subscription;
  private deletePersonSubscription!: Subscription;
  action!: string;
  pageError: string = '';
  personEditForm!: FormGroup;
  pageStatus: string = PageAction.None;
  personId!: number;
  selectedPerson!: Person;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonApiService,
    private editPersonFormBuilder: FormBuilder
  ) {}

  initiateEditPersonForm(person: Person) {
    debugger
    //let formattedDate = format(person.dateOfBirth, 'yyyy-MM-dd');

    this.personEditForm = this.editPersonFormBuilder.group({
      categoryField: [person.category, Validators.required],
      dateOfBirthField: [person.dateOfBirth, Validators.required],
      firstNameField: [person.firstName, Validators.required],
      isPlaySportsField: [person.isPlaySports, Validators.required],
      lastNameField: [person.lastName, Validators.required],
      rankField: [person.rank, Validators.required],
    });
  }

  isFormEdited(): boolean {
    return Object.values(this.personEditForm.controls).some(
      (control) => control.dirty
    );
  }

  canDeactivate(): boolean {
    let hasUnsavedChanges = this.isFormEdited();
    if (this.pageStatus !== PageAction.CompleteAction) {
      if (hasUnsavedChanges) {
        return confirm(
          'You have unsaved changes. Do you really want to leave?'
        );
      }
    }
    return true;
  }

  getPersonByPersonId(personId: number): void {
    this.getPersonByPersonIdSubscription = this.personService
      .GetPersonByPersonId(personId)
      .subscribe({
        next: (person) => {
          this.selectedPerson = person;
          console.log(this.selectedPerson);
          this.initiateEditPersonForm(this.selectedPerson);
        },
        error: (e) => console.error(e),
        complete: () => console.info('complete'),
      });
  }

  savePerson(): void {
    if (this.personEditForm.valid) {
      this.selectedPerson.category =
        this.personEditForm.get('categoryField')?.value;

      this.selectedPerson.dateOfBirth = new Date(
        this.personEditForm.get('dateOfBirthField')?.value
      );

      this.selectedPerson.firstName =
        this.personEditForm.get('firstNameField')?.value;

      this.selectedPerson.isPlaySports =
        this.personEditForm.get('isPlaySportsField')?.value;

      this.selectedPerson.lastName =
        this.personEditForm.get('lastNameField')?.value;

      this.selectedPerson.rank = this.personEditForm.get('rankField')?.value;

      if (this.action == PageAction.EditAction) {
        this.editPerson();
      }

      if (this.action == PageAction.AddAction) {
        this.addPerson();
      }
    } else {
      this.pageError = 'SET ALL REQUIRED FIELDS WITH CORRECT VALUE';
    }
  }

  addPerson(): void {
    this.addPersonSubscription = this.personService
      .AddPerson(this.selectedPerson)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.pageStatus = PageAction.CompleteAction;
        },
        error: (e) => console.error(e),
        complete: () => {
          this.routeBack(PageAction.AddAction, PageAction.CompleteAction);
        },
      });
  }

  editPerson(): void {
    this.editPersonSubscription = this.personService
      .EditPerson(this.selectedPerson, this.personId)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.pageStatus = PageAction.CompleteAction;
        },
        error: (e) => console.error(e),
        complete: () => {
          this.routeBack(PageAction.EditAction, PageAction.CompleteAction);
        },
      });
  }

  deletePerson(): void {
    this.deletePersonSubscription = this.personService
      .DeletePerson(this.personId)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.pageStatus = PageAction.CompleteAction;
        },
        error: (e) => console.error(e),
        complete: () => {
          this.routeBack(PageAction.DeleteAction, PageAction.CompleteAction);
        },
      });
  }

  cancel(): void {
    this.routeBack(PageAction.CancelAction, PageAction.None);
  }

  routeBack(action: string, state: string): void {
    this.pageStatus = state;

    this.router.navigate(['/person'], {
      queryParams: {
        action: action,
        state: state,
        id: this.personId,
      },
    });
  }

  ngOnInit() {
    this.personId = this.route.snapshot.params['id'];

    if (this.personId) {
      this.getPersonByPersonId(this.personId);
      this.action = PageAction.EditAction;
    } else {
      this.action = PageAction.AddAction;
      this.selectedPerson = {
        id: null,
        firstName: '',
        lastName: '',
        rank: 0,
        category: '',
        dateOfBirth: new Date(1981, 3, 11),
        isPlaySports: false,
        dateCreated: new Date(2024, 11, 11),
      };

      this.initiateEditPersonForm(this.selectedPerson);
    }
  }

  ngOnDestroy() {
    this.getPersonByPersonIdSubscription?.unsubscribe();
    this.deletePersonSubscription?.unsubscribe();
    this.editPersonSubscription?.unsubscribe();
    this.addPersonSubscription?.unsubscribe();
  }
}
