import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../../interfaces/user.interface';
import { catchError } from 'rxjs/operators';
import { LoginForm } from '../../pages/auth/models/login-form.interface';
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth2Service {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private auth = inject(Auth);
  private router = inject(Router);

  constructor() {}

  private csrfFetched = false;

  getCSRFToken(): Observable<any> {
    if (this.csrfFetched) return of(null);
    this.csrfFetched = true;
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
      observe: 'response',
    });
  }

  getUser(): Observable<User | null> {
    if (this.userSubject.value) {
      return of(this.userSubject.value);
    }

    return this.http
      .get<any>(`${this.apiUrl}/api/user`, {
        withCredentials: true,
      })
      .pipe(
        map((user: any) => {
          // Convertimos roles complejos a string[]
          const roles = Array.isArray(user.roles)
            ? user.roles.map((role: any) => role.name || role)
            : [];
          return { ...user, roles };
        }),
        tap((user: User) => {
          this.userSubject.next(user);
        }),
        catchError(() => {
          this.clearUser();
          return of(null);
        })
      );
  }

  login(form: LoginForm): Observable<User | null> {
    return this.getCSRFToken().pipe(
      switchMap(() =>
        this.http.post<{ user: User; roles: string[] }>(
          `${this.apiUrl}/api/login`,
          form,
          { withCredentials: true }
        )
      ),
      tap((res) => {
        const roles = res.roles ?? [];
        const userWithRoles = { ...res.user, roles };
        this.setUser(userWithRoles);
        console.log('[Auth2Service] User:', userWithRoles);
      }),
      map((res) => res.user),
      catchError((error) => {
        this.clearUser();
        console.error('Error en login', error);
        return of(null);
      })
    );
  }

  setUser(user: User | null): void {
    this.userSubject.next(user);
  }

  clearUser(): void {
    this.userSubject.next(null);
  }

  logout(): Observable<any> {
    return this.http
      .post(
        `${this.apiUrl}/api/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(() => {
          console.log('[AuthService] Logout exitoso. Limpiando estado...');
          this.clearUser();
        }),
        catchError((err) => {
          console.error('Error al desloguear', err);
          this.clearUser();
          return of(null);
        })
      );
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const result = await signInWithPopup(this.auth, new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();

      const response = await firstValueFrom(
        this.http.post<{ user: User; roles: User }>(
          `${this.apiUrl}/api/firebase-login`,
          { id_token: idToken },
          { withCredentials: true }
        )
      );

      if (response?.user) {
        const cleanRoles = Array.isArray(response.roles)
          ? response.roles.map((r: any) => (typeof r === 'string' ? r : r.name))
          : [];

        const userWithRoles = { ...response.user, roles: cleanRoles };
        this.setUser(userWithRoles);

        console.log('[Auth2Service] Usuario logueado con Google:', userWithRoles);

        this.router.navigate(['/dashboard']);
      }
    } catch (error: any) {
      console.error('Error en login con Google:', error.message || error);
      this.clearUser();
      throw new Error(error.message || 'No se pudo iniciar sesión con Google');
    }
  }

  hasRole(role: string): boolean {
    const roles = this.userSubject.value?.roles ?? [];
    return roles.includes(role);
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }
}
