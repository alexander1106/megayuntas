import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface Nosotros {
  descripcion: string;
  mision: string;
  vision: string;
  telefono: string | number;
  direccion: string;
}

@Injectable({
  providedIn: 'root'
})
export class NosotrosService {
  private api_url = environment.apiUrl + '/nosotros';

  constructor(private httpClient: HttpClient) { }

  getNosotros(): Observable< Nosotros > {
      return this.httpClient.get< Nosotros >(this.api_url);
  }

}