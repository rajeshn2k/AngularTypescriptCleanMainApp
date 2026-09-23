import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>User Profile</h2>
        <div *ngIf="user">
          <div class="profile-item">
            <label>Name:</label>
            <span>{{ user.name }}</span>
          </div>
          <div class="profile-item">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>
          <div class="profile-item" *ngIf="user.picture">
            <label>Picture:</label>
            <img [src]="user.picture" alt="Profile" class="profile-picture" />
          </div>
          <div class="profile-item" *ngIf="user.nickname">
            <label>Nickname:</label>
            <span>{{ user.nickname }}</span>
          </div>
        </div>
        <div class="profile-actions">
          <button (click)="logout()" class="logout-button">Logout</button>
          <button (click)="goBack()" class="back-button">Back</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
      }
      .profile-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 500px;
        width: 100%;
      }
      .profile-card h2 {
        color: #333;
        margin-bottom: 1.5rem;
        text-align: center;
      }
      .profile-item {
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: #f8f9fa;
        border-radius: 4px;
      }
      .profile-item label {
        display: block;
        font-weight: bold;
        color: #555;
        margin-bottom: 0.25rem;
      }
      .profile-item span {
        color: #333;
      }
      .profile-picture {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        margin-top: 0.5rem;
      }
      .profile-actions {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
        justify-content: center;
      }
      .logout-button,
      .back-button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
      }
      .logout-button {
        background: #dc3545;
        color: white;
      }
      .logout-button:hover {
        background: #c82333;
      }
      .back-button {
        background: #6c757d;
        color: white;
      }
      .back-button:hover {
        background: #5a6268;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.currentUser;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
