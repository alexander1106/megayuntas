// src/app/service/consultas/consultas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Consulta {
  id: string; // ⭐ ID Encriptado
  consulta: string;
  productos: string;
  modulos: string;
  descripcion?: string;
  video?: string;
  mostrar?: boolean;
  consultasRelacionadas?: string[]; // IDs de relaciones también son strings
}

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private baseUrl = `${environment.apiUrl}/consultas`;

  constructor(private http: HttpClient) { }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  listarConsultas(): Observable<Consulta[]> {
    return this.http.get<Consulta[]>(this.baseUrl, { headers: this.authHeaders() });
  }

  crearConsulta(consulta: Omit<Consulta, 'id'>): Observable<Consulta> {
    return this.http.post<Consulta>(this.baseUrl, consulta, { headers: this.authHeaders() });
  }

  actualizarConsulta(consulta: Consulta): Observable<any> {
    return this.http.put(this.baseUrl, consulta, { headers: this.authHeaders() });
  }

  eliminarConsulta(idEncriptado: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${idEncriptado}`, { headers: this.authHeaders() });
  }
}