import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlEncryptionService {
  /**
   * Encapsula un ID numérico para URL encriptada
   * Uso: Este ID viene del backend encriptado
   */
  encryptIdForUrl(id: number): string {
    // El backend devuelve el ID ya encriptado
    // Solo lo pasamos a la URL
    return String(id);
  }

  /**
   * Extrae un ID encriptado de la URL
   * Uso: Cuando recibimos un ID encriptado desde la URL
   */
  decryptIdFromUrl(encryptedId: string): string {
    // El ID viene encriptado desde la URL
    // Lo enviamos encriptado al backend
    return encryptedId;
  }
}