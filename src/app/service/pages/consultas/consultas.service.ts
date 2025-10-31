import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Consultas{
    id: string | number;
    titulo: string;
    descripcion: string;
    producto: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private api_url = environment.apiUrl + '/consultas';

  constructor(private httpClient: HttpClient) { }
  getConsulta(): Observable<{consultas: Consultas[]}> {
    return this.httpClient.get<{ consultas: Consultas[] }>(this.api_url);
  }
}
