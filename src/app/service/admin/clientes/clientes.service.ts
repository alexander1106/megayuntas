// src/app/service/clientes/clientes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Cliente {
  id: string; // ⭐ ID Encriptado (String)
  nombreEmpresa: string;
  ruc: string;
  telefono: string;
  contacto: string;
  grupo: string;
  mostrarEnWeb: boolean;
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
      'Authorization': `Bearer ${token}`,
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

  /** PUT /api/clientes — Actualizar cliente */
  // ⭐ El ID va dentro del objeto 'cliente' en el body
  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(
      this.baseUrl, // Se envía a la raíz, el backend extrae el ID del body
      cliente,
      { headers: this.authHeaders() }
    );
  }

  /** DELETE /api/clientes/:id — Eliminar cliente */
  eliminarCliente(idEncriptado: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${idEncriptado}`, // ⭐ ID en la URL
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
  getClientePorId(idEncriptado: string): Observable<Cliente> {
    return this.http.get<Cliente>(
      `${this.baseUrl}/${idEncriptado}`,
      { headers: this.authHeaders() }
    );
  }
}