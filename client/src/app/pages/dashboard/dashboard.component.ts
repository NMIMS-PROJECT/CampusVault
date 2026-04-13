import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="!loading && dashboardData">
        <div class="stats">
          <div class="stat-card">
            <h3>Credits</h3>
            <p>{{ dashboardData.credits }}</p>
          </div>
          <div class="stat-card">
            <h3>Tier</h3>
            <p>{{ dashboardData.tier }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }
    .stat-card {
      padding: 1rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
  `],
})
export class DashboardComponent implements OnInit {
  dashboardData: any;
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
