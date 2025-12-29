import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eliminar-productos-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eliminar-productos-modal.component.html',
  styleUrl: './eliminar-productos-modal.component.css'
})
export class EliminarProductosModalComponent {
  // ⭐ CAMBIO: ID es string
  @Input() productoId: string | null = null;
  
  @Output() confirmar = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  confirmarEliminacion() {
    if (this.productoId) {
      this.confirmar.emit(this.productoId);
    }
  }

  cancelarEliminacion() {
    this.cancelar.emit();
  }
}