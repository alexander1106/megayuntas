import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment'; // Ajusta la ruta a tu environment
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private apiUrl = `${environment.apiUrl}/administradores`;

  constructor(private http: HttpClient) {}

  /** Genera los headers con el token para Auditoría */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ============================================================================
  // LISTAR ADMINISTRADORES
  // ============================================================================
  getAdministradores(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // ============================================================================
  // CREAR ADMINISTRADOR
  // ============================================================================
  crearAdministrador(data: any): Observable<any> {
    // Se envía como JSON en el body
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  // ============================================================================
  // ACTUALIZAR ADMINISTRADOR
  // ============================================================================
  actualizarAdministrador(adm: any): Observable<any> {
    // Validación básica de contraseñas (opcional, idealmente va en el componente)
    if (adm.passwordActual) {
       if (!adm.nuevaPassword || !adm.confirmarPassword) {
          throw new Error('Debe completar todos los campos de contraseña');
       }
       if (adm.nuevaPassword !== adm.confirmarPassword) {
          throw new Error('La nueva contraseña y su confirmación no coinciden');
       }
    }

    // El backend espera el objeto completo en el body (incluyendo ID encriptado)
    return this.http.put(
      this.apiUrl, 
      adm, 
      { headers: this.getAuthHeaders() }
    );
  }

  // ============================================================================
  // ELIMINAR ADMINISTRADOR
  // ============================================================================
  eliminarAdministrador(idEncriptado: string): Observable<any> {
    // ⭐ Usa DELETE y el ID va en la URL
    return this.http.delete(
      `${this.apiUrl}/${idEncriptado}`, 
      { headers: this.getAuthHeaders() }
    );
  }
}