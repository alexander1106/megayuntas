import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ConsultaRelacionada {
  id: number;
  titulo: string;
}

@Component({
  selector: 'app-relacionar-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relacionar-consultas.component.html',
  styleUrl: './relacionar-consultas.component.css'
})
export class RelacionarConsultasComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() consultasRelacionadas = new EventEmitter<ConsultaRelacionada[]>();
  @Input() consultaId: number | null = null;

  buscarTexto = '';
  consultasDisponibles: ConsultaRelacionada[] = [
    { id: 1, titulo: '¿Cómo crear Series de Documentos?' },
    { id: 2, titulo: '¿Cómo configurar permisos de usuario?' },
    { id: 3, titulo: '¿Cómo generar reportes mensuales?' },
    { id: 4, titulo: '¿Cómo realizar backup de datos?' },
    { id: 5, titulo: '¿Cómo integrar APIs externas?' },
    { id: 6, titulo: '¿Cómo optimizar el rendimiento?' },
    { id: 7, titulo: '¿Cómo resolver errores comunes?' }
  ];

  consultasSeleccionadas: ConsultaRelacionada[] = [
    { id: 1, titulo: '¿Cómo crear Series de Documentos?' }
  ];

  consultasFiltradas: ConsultaRelacionada[] = [];

  ngOnInit() {
    this.filtrarConsultas();
  }

  filtrarConsultas() {
    if (this.buscarTexto.trim() === '') {
      this.consultasFiltradas = [];
    } else {
      this.consultasFiltradas = this.consultasDisponibles.filter(consulta =>
        consulta.titulo.toLowerCase().includes(this.buscarTexto.toLowerCase()) &&
        !this.consultasSeleccionadas.some(selected => selected.id === consulta.id) &&
        consulta.id !== this.consultaId // Excluir la consulta actual
      );
    }
  }

  onBuscarChange() {
    this.filtrarConsultas();
  }

  agregarConsulta(consulta: ConsultaRelacionada) {
    if (!this.consultasSeleccionadas.some(selected => selected.id === consulta.id)) {
      this.consultasSeleccionadas.push(consulta);
      this.filtrarConsultas(); // Actualizar la lista filtrada
      this.buscarTexto = ''; // Limpiar el campo de búsqueda
    }
  }

  eliminarConsulta(consultaId: number) {
    this.consultasSeleccionadas = this.consultasSeleccionadas.filter(
      consulta => consulta.id !== consultaId
    );
    this.filtrarConsultas(); // Actualizar la lista filtrada
  }

  onGuardar() {
    console.log('Consultas relacionadas guardadas:', this.consultasSeleccionadas);
    this.consultasRelacionadas.emit(this.consultasSeleccionadas);
    this.cerrarModal();
  }

  onCancelar() {
    this.cerrarModal();
  }

  private cerrarModal() {
    this.cerrar.emit();
  }
}