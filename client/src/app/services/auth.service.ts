import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem('authToken')
  );
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private userSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('user') || 'null')
  );
  user$ = this.userSubject.asObservable();

  constructor(private apiService: ApiService) {}

  login(email: string, password: string): Observable<any> {
    return this.apiService.login(email, password).pipe(
      tap((response) => {
        if (response.token) {
          this.apiService.setAuthToken(response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
          this.userSubject.next(response.user);
        }
      })
    );
  }

  register(data: any): Observable<any> {
    return this.apiService.register(data).pipe(
      tap((response) => {
        if (response.token) {
          this.apiService.setAuthToken(response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.isAuthenticatedSubject.next(true);
          this.userSubject.next(response.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
