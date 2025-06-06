import {
  HttpInterceptorFn,
  HttpXsrfTokenExtractor,
} from '@angular/common/http';
import { inject } from '@angular/core';

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(HttpXsrfTokenExtractor);

  const csrfToken = token.getToken();
  if (csrfToken && !req.headers.has('X-XSRF-TOKEN')) {
    const clonedReq = req.clone({
      headers: req.headers.set('X-XSRF-TOKEN', csrfToken),
    });
    return next(clonedReq);
  }
  return next(req);
};
