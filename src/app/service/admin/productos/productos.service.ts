import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CrearProductoDTO {
  nombre: string;
  descripcion: string;
  imagen: string;
  caracteristicas?: string;
  descarga?: string;
  video?: string;
  caja?: string;
  titdescarga?: string;
  ultimaversion?: string;
}

interface ActualizarProductoDTO {
  id: string;  // ⭐ ID encriptado
  nombre: string;
  descripcion: string;
  imagen: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://turistas.spring.informaticapp.com:9000/api/productos';

  constructor(private http: HttpClient) { }

  // ============================================================================
  // LISTAR PRODUCTOS
  // ============================================================================

  /**
   * Obtiene lista de productos del backend
   * Respuesta: { id: "Xy9-zRq2", nombre: "...", descripcion: "...", imagen: "..." }[]
   */
  listarProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  // ============================================================================
  // OBTENER PRODUCTO POR ID ENCRIPTADO
  // ============================================================================

  /**
   * Obtiene detalle de un producto específico
   * @param idEncriptado ID encriptado del backend (ej: "Xy9-zRq2")
   */
  obtenerProducto(idEncriptado: string): Observable<any> {
    // ⭐ El ID va encriptado en la URL
    return this.http.get<any>(`${this.apiUrl}/${idEncriptado}`);
  }

  // ============================================================================
  // CREAR PRODUCTO
  // ============================================================================

  /**
   * Crea un nuevo producto
   * Respuesta: { idProducto: "Xy9-zRq2" }  ⭐ ID encriptado
   */
  crearProducto(dto: CrearProductoDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, dto);
  }

  // ============================================================================
  // ACTUALIZAR PRODUCTO
  // ============================================================================

  /**
   * Actualiza un producto existente
   * @param dto Debe incluir ID encriptado
   */
  actualizarProducto(dto: ActualizarProductoDTO): Observable<any> {
    // ⭐ Enviar el DTO completo con ID encriptado en el body
    return this.http.put<any>(`${this.apiUrl}`, dto);
  }

  // ============================================================================
  // ELIMINAR PRODUCTO
  // ============================================================================

  /**
   * Elimina un producto
   * @param idEncriptado ID encriptado (ej: "Xy9-zRq2")
   */
  eliminarProducto(idEncriptado: string): Observable<any> {
    // ⭐ El ID va encriptado en la URL
    return this.http.delete<any>(`${this.apiUrl}/${idEncriptado}`);
  }

  // ============================================================================
  // MÉTODOS ANTIGUOS (MANTENER POR COMPATIBILIDAD SI ES NECESARIO)
  // ============================================================================

  /**
   * Obtiene detalle completo del producto (con multimedia)
   * @param idEncriptado ID encriptado
   */
  obtenerVistaProducto(idEncriptado: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idEncriptado}`);
  }
}
