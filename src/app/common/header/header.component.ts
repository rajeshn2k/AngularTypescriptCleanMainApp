import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  /* @Input() decorator in a child component or directive to let Angular know that 
  a property in that component can receive its value from its parent component. */

  @Input() appHeaderText: string = 'Rajesh Angular Application';
  
  constructor(private authService: AuthService, private router: Router) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get userName(): string {
    const user = this.authService.currentUser;
    return user?.name || user?.nickname || 'User';
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
