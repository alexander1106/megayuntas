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
  
  // CAMBIO: El ID ahora es string porque viene encriptado
  @Input() usuarioId: string | null = null;

  // CAMBIO: El evento debe emitir un string
  @Output() confirmar = new EventEmitter<string>();

  @Output() cancelar = new EventEmitter<void>();

  confirmarEliminacion(): void {
    console.log('ID a eliminar (encriptado):', this.usuarioId);
    
    // Verificamos que no sea null ni undefined
    if (this.usuarioId) {
      this.confirmar.emit(this.usuarioId);
    }
  }

  cancelarEliminacion(): void {
    this.cancelar.emit();
  }
}