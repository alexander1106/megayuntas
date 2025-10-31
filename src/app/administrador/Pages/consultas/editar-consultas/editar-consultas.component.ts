import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-consultas.component.html',
  styleUrl: './editar-consultas.component.css'
})
export class EditarConsultasComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() consultaEditada = new EventEmitter<any>();
  @Input() consultaId: number | null = null;

  consulta = '';
  descripcion = '';
  video = '';
  productoSeleccionado = '';
  moduloSeleccionado = '';
  mostrar = true;

  productos = [
    { id: 1, nombre: 'Producto 1' },
    { id: 2, nombre: 'Producto 2' },
    { id: 3, nombre: 'Producto 3' }
  ];

  modulos = [
    { id: 1, nombre: 'Módulo 1' },
    { id: 2, nombre: 'Módulo 2' },
    { id: 3, nombre: 'Módulo 3' }
  ];

  ngOnInit() {
    // Aquí puedes cargar los datos de la consulta a editar
    // basándote en el consultaId recibido
    if (this.consultaId) {
      this.cargarDatosConsulta();
    }
  }

  private cargarDatosConsulta() {
    // Aquí cargarías los datos de la consulta existente
    // Por ahora, datos de ejemplo
    this.consulta = 'Consulta de ejemplo';
    this.descripcion = 'Descripción de ejemplo';
    this.video = 'https://ejemplo.com/video';
    this.productoSeleccionado = '1';
    this.moduloSeleccionado = '2';
    this.mostrar = true;
  }

  onGuardar() {
    // Validar que los campos requeridos estén llenos
    if (!this.consulta.trim()) {
      alert('Por favor, ingrese el título de la consulta');
      return;
    }
    
    if (!this.descripcion.trim()) {
      alert('Por favor, ingrese la descripción');
      return;
    }

    const consultaEditada = {
      id: this.consultaId,
      consulta: this.consulta,
      descripcion: this.descripcion,
      video: this.video,
      producto: this.productoSeleccionado,
      modulo: this.moduloSeleccionado,
      mostrar: this.mostrar
    };
    
    console.log('Consulta editada:', consultaEditada);
    
    // Emitir el evento con los datos de la consulta editada
    this.consultaEditada.emit(consultaEditada);
    
    // Cerrar modal
    this.cerrarModal();
  }

  onCancelar() {
    this.cerrarModal();
  }

  private cerrarModal() {
    // Emitir evento para cerrar el modal
    this.cerrar.emit();
  }

  toggleMostrar() {
    this.mostrar = !this.mostrar;
  }
}