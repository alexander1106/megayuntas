import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface BusquedaReciente {
  titulo: string;
}

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {
  private apiUrl = environment.apiUrl + '/busquedas/recientes';

  constructor(private http: HttpClient) {}

  obtenerBusquedasRecientes(): Observable<BusquedaReciente[]> {
    return this.http.get<BusquedaReciente[]>(this.apiUrl);
  }
}
