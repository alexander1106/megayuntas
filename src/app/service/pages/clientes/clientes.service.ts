import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  nombreEmpresa?: string;  // ? indica que puede ser null o undefined
  ruc?: string;
  telefono?: string;
  contacto?: string;
  grupo?: string;
  mostrarEnWeb?: any
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
