import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Comentario {
  idComentario: number;
  comentario: string;
  fecha: string;
  nombres: string;
  apellidos: string;
  nombreEmpresa: string;
  imagenUsuario: string;
}

export interface ComentarioNuevo {
  idConsulta: number;
  comentario: string;
  nombres: string;
  apellidos: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private apiUrl = `${environment.apiUrl}/comentarios`;

  constructor(private http: HttpClient) {}

  obtenerComentarios(idConsulta: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.apiUrl}?idConsulta=${idConsulta}`);
  }

  enviarComentario(nuevoComentario: ComentarioNuevo): Observable<any> {
    return this.http.post(this.apiUrl, nuevoComentario);
  }
}
