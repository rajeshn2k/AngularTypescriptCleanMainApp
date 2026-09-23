import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Welcome to Book & Person Management</h2>
        <p>Please log in to access the application.</p>
        <button (click)="login()" class="login-button">
          Log In with Auth0
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .login-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 90%;
      }
      .login-card h2 {
        color: #333;
        margin-bottom: 1rem;
      }
      .login-card p {
        color: #666;
        margin-bottom: 2rem;
      }
      .login-button {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.3s;
      }
      .login-button:hover {
        background: #5568d3;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.redirectToReturnUrl();
    }
  }

  login(): void {
    this.authService.login().subscribe(() => {
      // Auth0 will redirect to the callback URL
    });
  }

  private redirectToReturnUrl(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.router.navigate([returnUrl]);
  }
}
