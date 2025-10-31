import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-eliminar-usuarios-modal',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './eliminar-usuarios-modal.component.html',
  styleUrl: './eliminar-usuarios-modal.component.css'
})
export class EliminarUsuariosModalComponent {
  // ID del usuario que se desea eliminar
  @Input() usuarioId: number | null = null;

  // Evento que se emite cuando se confirma la eliminación
  @Output() confirmar = new EventEmitter<number>();

  // Evento que se emite cuando se cancela la acción
  @Output() cancelar = new EventEmitter<void>();

  // Método para confirmar la eliminación
  confirmarEliminacion(): void {
    console.log('ID a eliminar:', this.usuarioId); // Debug: asegúrate que no sea undefined
    if (this.usuarioId !== null) {
      this.confirmar.emit(this.usuarioId);
    }
  }

  // Método para cancelar la eliminación
  cancelarEliminacion(): void {
    this.cancelar.emit();
  }
}
