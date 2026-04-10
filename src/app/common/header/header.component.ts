import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  /* @Input() decorator in a child component or directive to let Angular know that 
  a property in that component can receive its value from its parent component. */

  @Input() appHeaderText: string = 'Rajesh Angular Application';
  
  constructor() {}
}
