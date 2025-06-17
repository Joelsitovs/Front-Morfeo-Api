import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user.interface';
import { catchError } from 'rxjs/operators';
import { LoginForm } from '../../layouts/pages/auth/models/login-form.interface';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Auth2Service {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private _user = signal<User | null>(this.loadUserFromStorage());

  // Señal pública
  readonly user = computed(() => this._user());
  readonly user$ = toObservable(this.user);

  constructor() {}

  private loadUserFromStorage(): User | null {
    try {
      const data = localStorage.getItem('auth.user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private saveUserToStorage(user: User | null): void {
    if (user) {
      localStorage.setItem('auth.user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth.user');
    }
  }

  getCSRFToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
      observe: 'response',
    });
  }

  getUser() {
    return this.http
      .get<User>(`${this.apiUrl}/api/user`, {
        withCredentials: true,
      })
      .pipe(
        tap((user) => {
          this._user.set(user);
          this.saveUserToStorage(user);
        }),
        catchError(() => {
          this.clearUser();
          return of(null);
        })
      );
  }

  //asdhsahjdhjksa
  login(form: LoginForm): Observable<User | null> {
    return this.getCSRFToken().pipe(
      switchMap(() =>
        this.http.post<{ user: User }>(`${this.apiUrl}/api/login`, form, {
          withCredentials: true,
        })
      ),
      tap((response) => {
        const user = response.user;
        console.log('[Auth2Service] Usuario recibido del login:', user);
        this.setUser(user); // <- este es el user real
      }),
      map((response) => response.user),
      catchError(() => {
        this.clearUser();
        return of(null);
      })
    );
  }

  setUser(user: User | null): void {
    this._user.set(user);
    this.saveUserToStorage(user);
  }

  clearUser(): void {
    this._user.set(null);
    this.saveUserToStorage(null);
  }

  logout() {
    return this.http
      .post(
        `${this.apiUrl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => this.clearUser()),
        catchError((err) => {
          this.clearUser();
          return of(null);
        })
      );
  }
}
