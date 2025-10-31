import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Cliente {
  id: number;
  nombreCliente: string;
  imagenCliente: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private url = environment.apiUrl + '/clientes';

  constructor(private http: HttpClient) {}

  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.url);
  }
}
