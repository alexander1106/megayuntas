import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const adminGuard: CanActivateFn = (route, state) => {
  const jwtHelper = inject(JwtHelperService);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  if (jwtHelper.isTokenExpired(token)) {
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }

  return true; // ✅ Permitir acceso a cualquiera con token válido
};
