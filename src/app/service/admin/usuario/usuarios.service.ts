import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // Asegúrate de que environment.apiUrl sea la base (ej: http://localhost:8080/api)
  private apiUrl = environment.apiUrl; 

  constructor(private http: HttpClient) {}

  /** * Genera los headers con el Token JWT.
   * Es CRUCIAL para que el backend identifique quién hace la petición (Auditoría).
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /** * Listar todos los usuarios.
   * Se asume que el backend devuelve IDs encriptados (strings).
   */
  getUsuarios(): Observable<any> {
    // Si tu backend usa /auth/usuarios cámbialo aquí, pero lo estándar es /usuarios
    return this.http.get(
      `${this.apiUrl}/usuarios`,
      { headers: this.getAuthHeaders() }
    );
  }

  /** * Crear un nuevo usuario.
   */
  crearUsuario(usuario: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/usuarios`,
      usuario,
      { headers: this.getAuthHeaders() }
    );
  }

  /** * Actualizar usuario.
   * Se envía el objeto completo (incluyendo el ID string) en el body.
   */
  actualizarUsuario(usuario: any): Observable<any> {
    console.log('Actualizando usuario:', usuario);
    return this.http.put(
      `${this.apiUrl}/usuarios`,
      usuario, // El ID va dentro de este objeto
      { headers: this.getAuthHeaders() }
    );
  }

  /** * Eliminar usuario por ID.
   * Se usa el verbo DELETE y se pasa el ID (hash) en la URL.
   */
  eliminarUsuario(idEncriptado: string): Observable<any> {
    // RESTful estándar: DELETE /api/usuarios/{id}
    return this.http.delete(
      `${this.apiUrl}/usuarios/${idEncriptado}`, 
      { headers: this.getAuthHeaders() }
    );
  }
}