import { Component, EventEmitter, Input, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-detalle-auditoria-modal',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './ver-detalle-auditoria-modal.component.html',
  styles: [`
    .json-box {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 10px;
      font-family: monospace;
      font-size: 0.85rem;
      max-height: 150px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
      color: #333;
    }
  `]
})
export class VerDetalleAuditoriaModalComponent {
  @Input() auditoria: any;
  @Output() cerrar = new EventEmitter<void>();

  cerrarModal() {
    this.cerrar.emit();
  }

  // Helper para formatear JSON si viene como string
  formatearJson(valor: any): string {
    if (!valor) return 'N/A';
    try {
      if (typeof valor === 'string') {
        const parsed = JSON.parse(valor);
        return JSON.stringify(parsed, null, 2);
      }
      return JSON.stringify(valor, null, 2);
    } catch (e) {
      return valor; // Si no es JSON válido, retorna el texto tal cual
    }
  }
}