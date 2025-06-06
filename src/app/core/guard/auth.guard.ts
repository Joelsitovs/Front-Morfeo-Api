import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, map, of, take } from 'rxjs';
import { Auth2Service } from '../services/auth2.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth2Service);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

export const NoLoginGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth2Service);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map((user) => {
      if (user) {
        if (user) {
          router.navigate(['/dashboard']);
          return false;
        }
        return false;
      }
      return true;
    })
  );
};
export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth2Service);
  const router = inject(Router);

  const user = authService.currentUser;

  if (user && user.roles.includes('admin')) {
    console.log('[RoleGuard] Autorizado como admin');
    return true;
  }

  console.log('[RoleGuard] No autorizado. Usuario sin rol admin');
  return false;
};
//reutilizable
/*
* export const RoleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth2Service);
  const router = inject(Router);

  const expectedRoles = (route.data['roles'] as string[]) || [];

  const user = authService.currentUser; // ✅ usamos el getter público

  if (user && expectedRoles.some(role => user.roles.includes(role))) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
*/
/*
export const makeAuthGuard =
  (mode: 'auth' | 'guest'): CanActivateFn =>
  () => {
    const auth = inject(Auth2Service);
    const router = inject(Router);

    return auth.user$.pipe(
      take(1),
      map((user) => {
        if (mode === 'auth' && user) return true;
        if (mode === 'guest' && !user) return true;

        const target = mode === 'auth' ? '/login' : '/dashboard';
        router.navigateByUrl(target, { replaceUrl: true });
        return false;
      })
    );
  };
*/
