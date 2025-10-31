import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Producto {
subtitulo: any;
  id: string | number;
  imagen: string;
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private api_url = environment.apiUrl + '/productos';

  constructor(private httpClient: HttpClient) {}

  getProducto(): Observable<{ productos: Producto[] }> {
    return this.httpClient.get<{ productos: Producto[] }>(this.api_url);
  }
}
