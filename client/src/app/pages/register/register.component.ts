import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="register-container">
      <h2>Register</h2>
      <form (ngSubmit)="onSubmit()">
        <div>
          <label>Name</label>
          <input type="text" [(ngModel)]="formData.name" name="name" required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" [(ngModel)]="formData.email" name="email" required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" [(ngModel)]="formData.password" name="password" required />
        </div>
        <div>
          <label>Phone</label>
          <input type="tel" [(ngModel)]="formData.phone" name="phone" />
        </div>
        <button type="submit">Register</button>
        <p *ngIf="error" class="error">{{ error }}</p>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      border: 1px solid #ccc;
      border-radius: 8px;
    }
    form div {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .error {
      color: red;
    }
  `],
})
export class RegisterComponent {
  formData = {
    name: '',
    email: '',
    password: '',
    phone: '',
  };
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.register(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
      },
    });
  }
}
