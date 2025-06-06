/*
// En tu AuthService (auth.service.ts)
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import {
  catchError,
  tap,
  map,
  switchMap,
  first,
  shareReplay,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginForm } from '../../pages/auth/models/login-form.interface'; // Asegúrate que la ruta sea correcta

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<any | null | undefined>(
    undefined
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private userHttp$: Observable<any | null> | null = null;

  constructor() {}

  getCSRFToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, {
      withCredentials: true,
      observe: 'response',
    });
  }

  getUser(): Observable<any | null> {
    const currentValue = this.currentUserSubject.getValue();

    if (currentValue !== undefined) {
      return this.currentUser$.pipe(first());
    }

    if (!this.userHttp$) {
      console.log('AuthService: Disparando petición HTTP REAL a /api/user...');
      this.userHttp$ = this.http
        .get<any>(`${this.apiUrl}/api/user`, { withCredentials: true })
        .pipe(
          tap((user) => {
            console.log('AuthService: Usuario obtenido de API:', user);
            this.currentUserSubject.next(user);
          }),
          catchError((error) => {
            console.error(
              'AuthService: Error al obtener usuario de API, estableciendo a null. Error:',
              error
            );
            this.currentUserSubject.next(null);
            return of(null); // Los guards esperan null en caso de error/no autenticado
          }),
          tap(() => {
            this.userHttp$ = null; // Permitir que futuras llamadas a refreshUser (si es necesario) hagan una nueva petición
          }),
          shareReplay(1) // Importante: comparte la petición y reemite el último valor
        );
    }
    return this.userHttp$.pipe(first());
  }

  public refreshUser(): Observable<any | null> {
    this.currentUserSubject.next(undefined); // Marcar como desconocido para forzar re-fetch
    this.userHttp$ = null; // Limpiar el observable cacheado de la petición HTTP
    return this.getUser();
  }

  login(form: LoginForm): Observable<any> {
    return this.getCSRFToken().pipe(
      switchMap(() =>
        this.http.post(`${this.apiUrl}/api/login`, form, {
          withCredentials: true,
        })
      ),
      tap((userResponse) => {
        console.log('Login exitoso, refrescando estado de usuario...');
        this.refreshUser().subscribe(); // O simplemente fuerza un re-fetch
      })
    );
  }

  register(name: string, email: string, password: string): Observable<any> {
    return this.getCSRFToken().pipe(
      switchMap(() =>
        this.http.post(
          `${this.apiUrl}/api/register`,
          { name, email, password },
          { withCredentials: true }
        )
      ),
      tap(() => {
        console.log('Registro exitoso, refrescando estado de usuario...');
        this.refreshUser().subscribe(); // Refrescar estado después del registro
      })
    );
  }

  // Ejemplo de un método logout
  logout(): Observable<any> {
    // Aquí podrías hacer una llamada HTTP a tu endpoint de logout si existe
    // return this.http.post(`${this.apiUrl}/api/logout`, {}, { withCredentials: true }).pipe(
    //   tap(() => {
    //     console.log('Logout exitoso en servidor, actualizando estado local.');
    //     this.currentUserSubject.next(null);
    //     this.userHttp$ = null; // Limpiar cache de petición
    //   }),
    //   catchError(err => {
    //     console.error('Error en logout del servidor, actualizando estado local de todas formas.');
    //     this.currentUserSubject.next(null); // Incluso si falla, localmente ya no hay usuario
    //     this.userHttp$ = null;
    //     return throwError(() => err);
    //   })
    // );

    console.log('Logout, actualizando estado local a null.');
    this.currentUserSubject.next(null);
    this.userHttp$ = null; // Limpiar la petición HTTP cacheada
    return of({ success: true }); // Devuelve un observable simple
  }

  getOla(): Observable<any> {
    // Manteniendo tu método original
    return this.http.get(`${this.apiUrl}/api/test`, {
      withCredentials: true,
    });
  }
}
*/
