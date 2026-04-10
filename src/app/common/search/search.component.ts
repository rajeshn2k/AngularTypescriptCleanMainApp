import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Output() searchRequest = new EventEmitter<string>();
  searchClick(value: string): void {
    this.searchRequest.emit(value);
    console.log(value)
  }
}
