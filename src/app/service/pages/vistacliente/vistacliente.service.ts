import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { Observable } from 'rxjs';

export interface ClienteProducto {
  idcliente: number;
  nombreCliente: string;
  nombreProducto: string;
}

@Injectable({
  providedIn: 'root'
})
export class VistaclienteService {
  private apiUrl = environment.apiUrl + '/clientes/vista';

  constructor(private http: HttpClient) {}

  obtenerProductosPorCliente(id: number): Observable<ClienteProducto[]> {
    return this.http.get<ClienteProducto[]>(`${this.apiUrl}/${id}`);
  }
}
