import { Component, OnDestroy, OnInit } from '@angular/core';
import { Person } from 'githubnodejstypescriptprinciplelibrary/lib/model/person';
import { Subscription } from 'rxjs';
import { PersonApiService } from '../service/person-api.service';
//import { SearchComponent } from 'githubangulartypescriptlibrary'

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.scss',
})
export class PersonListComponent implements OnInit, OnDestroy {
  public persons: Person[] = [];
  private getPersonSubscription!: Subscription;
  private message: string = '';
  constructor(private personService: PersonApiService) {}

  searchRequestHandle(message: string) {
    this.message = message;
  }

  getPersons(): void {
    this.getPersonSubscription = this.personService.GetPersons().subscribe({
      next: (persons) => {
        this.persons = persons;
      },
      error: (e) => console.error(e),
      complete: () => console.info('complete'),
    });
  }

  ngOnInit() {
    this.getPersons();
  }

  ngOnDestroy() {
    this.getPersonSubscription?.unsubscribe();
  }
}
