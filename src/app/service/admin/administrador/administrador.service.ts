import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Listar todos los administradores
  getAdministradores(): Observable<any> {
    return this.http.get(`${this.apiUrl}/administradores`);
  }

    // Crear un nuevo administrador
  crearAdministrador(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/administradores`, null, { params: data });
  }

actualizarAdministrador(adm: any): Observable<any> {
  const headers = this.getAuthHeaders(); // Asegúrate que esto incluya el token válido

  let params = new HttpParams()
    .set('id', adm.id.toString()) // ID como parámetro
    .set('nombres', adm.nombres || '') // Corregido: era 'nombre'
    .set('apellidos', adm.apellidos || '') // Corregido: era 'apellido'
    .set('username', adm.username || '')
    .set('email', adm.email || '')
    .set('rol', adm.rol ? adm.rol.toString() : '1'); // Campo 'rol' según Swagger

  // Solo agregar campos de password si se está cambiando la contraseña
  if (adm.passwordActual && adm.passwordActual.trim() !== '') {
    // Si se proporciona passwordActual, son obligatorios nuevaPassword y confirmarPassword
    if (!adm.nuevaPassword || !adm.confirmarPassword) {
      throw new Error('Si proporciona la contraseña actual, debe completar nueva contraseña y confirmar contraseña');
    }
    
    if (adm.nuevaPassword !== adm.confirmarPassword) {
      throw new Error('La nueva contraseña y la confirmación no coinciden');
    }

    params = params
      .set('passwordActual', adm.passwordActual)
      .set('nuevaPassword', adm.nuevaPassword)
      .set('confirmarPassword', adm.confirmarPassword);
  }

  console.log('Parámetros a enviar:', params.toString()); // Debug

  return this.http.put(
    `${this.apiUrl}/administradores`,  // URL sin ID según Swagger
    null, // Body vacío porque los datos van como query
    { headers, params }
  );
}
  // Eliminar un administrador (usa POST en lugar de DELETE)
  eliminarAdministrador(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/administradores/eliminar?id=${id}`, {});
  }

  // Método para obtener los encabezados de autenticación
  private getAuthHeaders(): { [header: string]: string } {
    // Reemplaza el siguiente token por el método real de obtención del token
    const token = localStorage.getItem('authToken') || '';
    return {
      'Authorization': `Bearer ${token}`
    };
  }
}
