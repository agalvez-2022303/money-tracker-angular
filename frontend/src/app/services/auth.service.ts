import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

interface TokenPayload {
  id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly SESSION_DURATION = 2 * 60 * 1000;

  private currentUser = signal<User | null>(null);
  private sessionTimer: any = null;

  user = computed(() => this.currentUser());
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.checkExistingSession();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap(response => {
          localStorage.setItem(this.TOKEN_KEY, response.token);
          this.currentUser.set(response.user);
          this.startSessionTimer();
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.clearSessionTimer();
    this.router.navigate(['/login']);
  }

  sessionExpired(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.clearSessionTimer();
    this.router.navigate(['/session-expired']);
  }

  private checkExistingSession(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        const now = Date.now() / 1000;
        
        if (decoded.exp > now) {
          this.currentUser.set({
            id: decoded.id,
            email: decoded.email,
            name: decoded.name
          });
          this.startSessionTimer();
        } else {
          this.sessionExpired();
        }
      } catch {
        this.logout();
      }
    }
  }

  private startSessionTimer(): void {
    this.clearSessionTimer();
    this.sessionTimer = setTimeout(() => {
      this.sessionExpired();
    }, this.SESSION_DURATION);
  }

  private clearSessionTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
