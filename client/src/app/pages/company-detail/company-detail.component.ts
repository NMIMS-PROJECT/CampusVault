import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-detail">
      <div *ngIf="loading">Loading...</div>
      <div *ngIf="!loading && company">
        <h2>{{ company.name }}</h2>
        <p>{{ company.description }}</p>
      </div>
    </div>
  `,
  styles: [`.company-detail { padding: 2rem; }`],
})
export class CompanyDetailComponent implements OnInit {
  company: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiService.getCompanyDetail(id).subscribe({
        next: (data) => {
          this.company = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }
}
