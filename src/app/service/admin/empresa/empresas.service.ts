// src/app/service/empresas/empresas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface InfoInstitucional {
  descripcion?: string;
  mision?: string;
  vision?: string;
  telefono?: string;
  direccion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private baseUrl = `${environment.apiUrl}/nosotros`;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** GET /api/nosotros */
  getInfoInstitucional(): Observable<InfoInstitucional> {
    return this.http.get<InfoInstitucional>(
      this.baseUrl,
      { headers: this.authHeaders() }
    );
  }

  /** PUT /api/nosotros */
  // CAMBIO: Se envía como JSON Body, más seguro y capaz para textos largos
  actualizarInfoInstitucional(data: InfoInstitucional): Observable<any> {
    return this.http.put(
      this.baseUrl,
      data, 
      { headers: this.authHeaders() }
    );
  }
}