import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the auth token from local storage
  const authToken = localStorage.getItem('auth_token');
  
  // If token exists, clone the request and add the auth header
  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }
  
  // Otherwise, proceed with the original request
  return next(req);
};