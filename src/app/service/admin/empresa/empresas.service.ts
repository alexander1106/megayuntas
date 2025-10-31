// src/app/service/empresas/empresas.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
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
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** GET /api/nosotros → trae todo el objeto */
  getInfoInstitucional(): Observable<InfoInstitucional> {
    return this.http.get<InfoInstitucional>(
      this.baseUrl,
      { headers: this.authHeaders() }
    );
  }

  /** PUT /api/nosotros?campo1=...&campo2=... → actualiza solo los que envíes */
  actualizarInfoInstitucional(data: InfoInstitucional): Observable<any> {
    let params = new HttpParams();
    if (data.descripcion) { params = params.set('descripcion', data.descripcion); }
    if (data.mision)      { params = params.set('mision', data.mision); }
    if (data.vision)      { params = params.set('vision', data.vision); }
    if (data.telefono)    { params = params.set('telefono', data.telefono); }
    if (data.direccion)   { params = params.set('direccion', data.direccion); }

    return this.http.put(
      this.baseUrl,
      null,
      { headers: this.authHeaders(), params }
    );
  }
}
