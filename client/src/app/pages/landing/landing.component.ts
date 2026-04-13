import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="landing-page">
      <header>
        <nav>
          <h1>CampusVault</h1>
          <ul>
            <li><a routerLink="/login">Login</a></li>
            <li><a routerLink="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <h2>Welcome to CampusVault</h2>
        <p>Your ultimate campus placement companion</p>
        <a routerLink="/register" class="cta-button">Get Started</a>
      </main>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: #1a1a1a;
      color: white;
    }
    header nav ul {
      display: flex;
      gap: 1rem;
      list-style: none;
    }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .cta-button {
      margin-top: 1.5rem;
      padding: 0.75rem 2rem;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
  `],
})
export class LandingComponent {}
