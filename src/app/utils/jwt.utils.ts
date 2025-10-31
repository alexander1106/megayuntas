// src/app/utils/jwt.utils.ts
import { JwtHelperService } from '@auth0/angular-jwt';

const helper = new JwtHelperService();

export function isTokenValid(): boolean {
  const token = localStorage.getItem('token');
  return token ? !helper.isTokenExpired(token) : false;
}

export function getTokenRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = helper.decodeToken(token);
  return decoded?.idRol?.toString() || null;
}
