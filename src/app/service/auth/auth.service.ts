import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ApiResponse } from '../../models/response.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';

  constructor(private http: HttpClient) {}

  // 🔹 Registrar un usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, userData);
  }

login(email: string, password: string): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(`${this.apiUrl}/login`, { email, password });
}


  // 🔹 Olvidó contraseña
  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // 🔹 Verificar código 2FA
  verify2FA(username: string, code: string) {
    return this.http.post(`${this.apiUrl}/verify-2fa`, { username, code });
  }

  // 🔹 Cambiar contraseña
  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/restablecer-password`, {
      token,
      password: newPassword
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  // 🔹 Generar QR 2FA
  enable2FA(username: string) {
    return this.http.get<{ otpAuthUrl: string; secret: string }>(
      `${this.apiUrl}/generate-qr/${username}`
    );
  }

getUserByDNI(dni: string): Observable<{ names: string; surnames: string }> {
  return this.http.get<{ names: string; surnames: string }>(
    `https://graphperu.daustinn.com/api/query/${dni}`
  ).pipe(
    catchError((error) => throwError(() => error))
  );
}

}
