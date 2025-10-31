// src/app/service/clientes/clientes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Cliente {
  id: number;
  nombreEmpresa: string;
  ruc: string;  // Cambiado de 'Ruc' a 'ruc' (minúscula)
  telefono: string;
  contacto: string;
  grupo: string;
  mostrarEnWeb: boolean;  // Cambiado de 'mostrarenWeb: string' a 'mostrarEnWeb: boolean'
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** GET /api/clientes — Listar clientes activos */
  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(
      this.baseUrl,
      { headers: this.authHeaders() }
    );
  }

  /** POST /api/clientes — Registrar un nuevo cliente */
  crearCliente(nuevo: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(
      this.baseUrl,
      nuevo,
      { headers: this.authHeaders() }
    );
  }

  /** PUT /api/clientes/:id — Actualizar cliente */
  actualizarCliente(id: number, cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.put<Cliente>(
      `${this.baseUrl}/${id}`,
      cliente,
      { headers: this.authHeaders() }
    );
  }

  /** DELETE /api/clientes/:id — Eliminar cliente */
  eliminarCliente(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`,
      { headers: this.authHeaders() }
    );
  }

  reporteClientes(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/reporte/excel`, {
      headers: this.authHeaders(),
      responseType: 'blob'
    });
  }

  /** GET /api/clientes/:id — Obtener cliente por ID */
  getClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.baseUrl}/${id}`,
      { headers: this.authHeaders() }
    );
  }
}