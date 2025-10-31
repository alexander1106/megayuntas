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

    // 🔹 Método para registrar un usuario
  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, userData);
  }

  login(username: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, { username, password });
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError((error) => throwError(() => error))
    );
  }

verify2FA(username: string, code: string) {
  return this.http.post(`${this.apiUrl}/verify-2fa`, { username, code });
}


  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/restablecer-password`, {
      token,
      password: newPassword
    }).pipe(
      catchError((error) => throwError(() => error))
    );
  }


enable2FA(username: string) {
      return this.http.get<{ otpAuthUrl: string; secret: string }>(
        `http://localhost:8080/api/auth/generate-qr/${username}`
      );
    }

}
