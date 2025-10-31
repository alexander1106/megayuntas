import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Publicacion {
  id: string | number;
  imagen: string;
  titulo: string;
  fecha: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private api_url = environment.apiUrl + '/publicaciones';

  constructor(private httpClient: HttpClient) {}

  getPublicacion(): Observable<{ publicaciones: Publicacion[] }> {
    return this.httpClient.get<{ publicaciones: Publicacion[] }>(this.api_url);
  }
}
