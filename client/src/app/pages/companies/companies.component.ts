import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="companies-container">
      <h2>Companies</h2>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="!loading" class="companies-grid">
        <div *ngFor="let company of companies" class="company-card" [routerLink]="['/companies', company.id]">
          <h3>{{ company.name }}</h3>
          <p>{{ company.description }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .companies-container {
      padding: 2rem;
    }
    .companies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .company-card {
      padding: 1rem;
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
    }
    .company-card:hover {
      background: #f0f0f0;
    }
  `],
})
export class CompaniesComponent implements OnInit {
  companies: any[] = [];
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCompanies().subscribe({
      next: (data) => {
        this.companies = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
