import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

// Interfaces
export interface Paso {
  tituloPaso: string;
  imagenPaso: string;
  descripcionPaso: string; // Contenido en HTML
}

export interface ConsultaDetalle {
  tituloConsulta: string;
  nombreProducto: string;
  descripcionConsulta: string;
  pasos: Paso[];
}

@Injectable({
  providedIn: 'root'
})
export class VistaconsultaService {
  private baseUrl = environment.apiUrl + '/consultas/vista?idConsulta=';

  constructor(private http: HttpClient) {}

  obtenerConsulta(id: number): Observable<ConsultaDetalle> {
    const endpoint = `${this.baseUrl}${id}`;
    return this.http.get<ConsultaDetalle>(endpoint);
  }
}
