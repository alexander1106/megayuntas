import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-eliminar-cliente-modal",
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./eliminar-cliente-modal.component.html",
})
export class EliminarClienteModalComponent {
  // ⭐ CAMBIO: ID es string (hash encriptado)
  @Input() clienteId: string | null = null;
  
  // ⭐ CAMBIO: Evento emite string
  @Output() confirmar = new EventEmitter<string>();
  @Output() cancelar = new EventEmitter<void>();

  confirmarEliminacion(): void {
    if (this.clienteId) {
      this.confirmar.emit(this.clienteId);
    }
  }

  cancelarEliminacion(): void {
    this.cancelar.emit();
  }
}