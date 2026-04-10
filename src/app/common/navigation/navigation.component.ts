import { Component } from '@angular/core';
import { EnvironmentService } from '../../../environments/environment-service'
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  constructor(public environmentService: EnvironmentService) {
  }
}
