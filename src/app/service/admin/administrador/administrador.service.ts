import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private apiUrl = 'http://localhost:8080/api/administradores';

  constructor(private http: HttpClient) {}

  // Crear administrador
  // Respuesta: { idAdministrador: "Xy9-zRq2" } (encriptado)
  crearAdministrador(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, null, {
      params: {
        nombres: data.nombres,
        apellidos: data.apellidos,
        username: data.username,
        password: data.password,
        email: data.email,
        rolNuevoAdministrador: data.rolNuevoAdministrador
      }
    });
  }

  // Listar administradores
  getAdministradores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // Actualizar administrador
  // idEncriptado: "Xy9-zRq2"
  actualizarAdministrador(admin: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, null, {
      params: {
        idEncriptado: admin.id, // ⭐ Aquí va el ID ENCRIPTADO
        nombres: admin.nombres,
        apellidos: admin.apellidos,
        username: admin.username,
        email: admin.email,
        rol: admin.rol,
        passwordActual: admin.passwordActual || '',
        nuevaPassword: admin.nuevaPassword || '',
        confirmarPassword: admin.confirmarPassword || ''
      }
    });
  }

  // Eliminar administrador
  // idEncriptado: "Xy9-zRq2"
  eliminarAdministrador(idEncriptado: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/eliminar/${idEncriptado}`, {});
  }
}