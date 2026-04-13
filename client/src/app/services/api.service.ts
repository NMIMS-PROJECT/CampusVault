import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
  }

  // Companies endpoints
  getCompanies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies`);
  }

  getCompanyDetail(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/companies/${id}`);
  }

  // Dashboard endpoints
  getDashboardData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/dashboard`);
  }

  // Assessment endpoints
  getAssessments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/assessment`);
  }

  // Forum endpoints
  getForumPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/questions`);
  }

  // Analyzer endpoints
  analyzeProfile(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/analyzer/analyze`, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  // Helper method to set auth token
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}
