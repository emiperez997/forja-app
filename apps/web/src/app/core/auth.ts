import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const TOKEN_KEY = 'foja_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/login', { email, password })
      .subscribe((res) => this.setToken(res.accessToken));
  }

  register(email: string, password: string, name?: string) {
    return this.http
      .post<{ accessToken: string }>('/api/auth/register', { email, password, name })
      .subscribe((res) => this.setToken(res.accessToken));
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
  }

  isLoggedIn() {
    return !!this.token();
  }
}
