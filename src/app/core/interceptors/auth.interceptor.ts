import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth2Service } from '../services/auth2.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(Auth2Service);
  const apiUrl = environment.apiUrl;

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const isUnauthorized = error.status === 401;
      const isUserEndpoint = req.url.includes('/api/user');
      const isLoginRoute = router.url.includes('/login');
      if (isUnauthorized && !isUserEndpoint && !isLoginRoute) {
        console.warn(
          '[authInterceptor] 401 detectado. Redirigiendo a /login...'
        );
        auth.clearUser();
        router.navigate(['/login'], { replaceUrl: true });
      }

      return throwError(() => error);
    })
  );
};
