// src/app/service/admin/usuario/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // Asegúrate de que environment.apiUrl apunte a tu base (ej: http://localhost:8080/api/auth)
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  /** Header con Token para que funcione la Auditoría en Backend */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** Listar todos los usuarios (Los IDs llegan encriptados) */
  getUsuarios(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/usuarios`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Crear un nuevo usuario */
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/usuarios`,
      usuario,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Actualizar un usuario existente */
  actualizarUsuario(usuario: any): Observable<any> {
    // El backend espera el objeto completo con el ID encriptado en el body
    return this.http.put(
      `${this.apiUrl}/usuarios`,
      usuario,
      { headers: this.getAuthHeaders() }
    );
  }

  /** Eliminar un usuario (Ahora usa DELETE y ID string) */
  eliminarUsuario(idEncriptado: string): Observable<any> {
    // Antes: POST .../eliminar?id=5
    // Ahora: DELETE .../Xy9-zRq2
    return this.http.delete(
      `${this.apiUrl}/usuarios/${idEncriptado}`, 
      { headers: this.getAuthHeaders() }
    );
  }
}