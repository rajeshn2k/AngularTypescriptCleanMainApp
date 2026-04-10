import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from '../../environments/environment-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  appEnvironmentName = '';
  bookApiBaseUrl = '';
  constructor(private environmentService: EnvironmentService) {}
  ngOnInit() {
    this.appEnvironmentName = this.environmentService.AppEnvironmentName;
    this.bookApiBaseUrl = this.environmentService.BookApiBaseUrl;
  }
}
