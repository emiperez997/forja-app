import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { NodesService } from './nodes.service';
import { SelectionService } from './selection.service';

const TOKEN_KEY = 'forja_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private nodesService: NodesService,
    private selectionService: SelectionService,
  ) {}

  login(email: string, password: string) {
    this.loading.set(true);
    this.errorMessage.set(null);

    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/api/auth/login`, { email, password })
      .pipe(
        tap((res) => {
          this.setToken(res.accessToken);
          this.loading.set(false);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.status === 401
              ? 'Email o contraseña incorrectos'
              : 'Ocurrió un error, intentá de nuevo',
          );
          return throwError(() => err);
        }),
      );
  }

  register(email: string, password: string, name?: string) {
    this.loading.set(true);
    this.errorMessage.set(null);

    return this.http
      .post<{ accessToken: string }>(`${environment.apiUrl}/api/auth/register`, {
        email,
        password,
        name,
      })
      .pipe(
        tap((res) => {
          this.setToken(res.accessToken);
          this.loading.set(false);
          this.router.navigate(['/']);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.errorMessage.set(
            err.status === 409
              ? 'Ese email ya está registrado'
              : 'Ocurrió un error, intentá de nuevo',
          );
          return throwError(() => err);
        }),
      );
  }

  private setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.token.set(token);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.nodesService.clear();
    this.selectionService.clear();
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!this.token();
  }
}
