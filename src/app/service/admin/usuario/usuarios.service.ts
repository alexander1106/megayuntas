// src/app/service/admin/usuario/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({

  providedIn: 'root'

})
export class UsuariosService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** Si no estás usando interceptor, descomenta esto y pásalo en cada llamada */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** Listar todos los usuarios */
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
    const headers = this.getAuthHeaders(); // Asegúrate que esto incluya el token válido

    // Según el Swagger, el ID va en el body, no en la URL
    const body = {
      id: usuario.id,        // ← INCLUIR EL ID EN EL BODY
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      email: usuario.email
    };

    console.log('Datos a enviar:', body); 

    // URL sin el ID al final
    return this.http.put(
      `${this.apiUrl}/usuarios`,  // ← SIN /${usuario.id}
      body,
      { headers }
    );
  }

  /** Eliminar un usuario (usa POST) */
  eliminarUsuario(id: number): Observable<any> {
      return this.http.post(`${this.apiUrl}/usuarios/eliminar?id=${id}`, {});
  }
}
