import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div class="callback-container">
      <div class="loading-spinner">
        <p>Processing authentication...</p>
      </div>
    </div>
  `,
  styles: [
    `
      .callback-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .loading-spinner {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .loading-spinner p {
        color: #333;
        font-size: 1.1rem;
      }
    `,
  ],
})
export class CallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.handleRedirectCallback().subscribe({
      next: () => {
        // Redirect to the return URL or home
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.router.navigate([returnUrl]);
      },
      error: (error) => {
        console.error('Authentication error:', error);
        this.router.navigate(['/login'], {
          queryParams: { error: 'authentication_failed' },
        });
      },
    });
  }
}
