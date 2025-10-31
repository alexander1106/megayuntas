import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-eliminar-administradores-modal',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './eliminar-administradores-modal.component.html',
  styleUrl: './eliminar-administradores-modal.component.css'
})
export class EliminarAdministradoresModalComponent {
  // ID del administrador que se desea eliminar
  @Input() adminsId: number | null = null;

  // Evento que se emite cuando se confirma la eliminación
  @Output() confirmar = new EventEmitter<number>();

  // Evento que se emite cuando se cancela la acción
  @Output() cancelar = new EventEmitter<void>();

  // Método para confirmar la eliminación
  confirmarEliminacion(): void {
    console.log('ID a eliminar:', this.adminsId); // Debug: asegúrate que no sea undefined
    if (this.adminsId !== null) {
      this.confirmar.emit(this.adminsId);
    }
  }

  // Método para cancelar la eliminación
  cancelarEliminacion(): void {
    this.cancelar.emit();
  }
}
