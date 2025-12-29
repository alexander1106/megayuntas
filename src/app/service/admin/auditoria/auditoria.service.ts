import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Auditoria {
  id: number;
  usuario: string;
  accion: string;
  descripcion: string;
  fecha: string;
  ipAddress: string;
  endpoint: string;
  metodoHttp: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditoriaService {
  private baseUrl = `${environment.apiUrl}/auditoria`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** GET /api/auditoria - Listar todo */
  getAuditorias(): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  /** GET /api/auditoria/usuario/{nombre} */
  getAuditoriasPorUsuario(nombre: string): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(
      `${this.baseUrl}/usuario/${nombre}`, 
      { headers: this.getAuthHeaders() }
    );
  }

  /** GET /api/auditoria/accion/{accion} */
  getAuditoriasPorAccion(accion: string): Observable<Auditoria[]> {
    return this.http.get<Auditoria[]>(
      `${this.baseUrl}/accion/${accion}`, 
      { headers: this.getAuthHeaders() }
    );
  }
}