import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-eliminar-cliente-modal",
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./eliminar-cliente-modal.component.html",
})
export class EliminarClienteModalComponent {
  @Input() clienteId: number | null = null
  @Output() confirmar = new EventEmitter<number>()
  @Output() cancelar = new EventEmitter<void>()

  // Método para confirmar la eliminación
  confirmarEliminacion(): void {
    if (this.clienteId !== null) {
      this.confirmar.emit(this.clienteId)
    }
  }

  // Método para cancelar la eliminación
  cancelarEliminacion(): void {
    this.cancelar.emit()
  }
}
