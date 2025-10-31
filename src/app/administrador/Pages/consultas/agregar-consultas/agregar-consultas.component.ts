import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agregar-consultas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-consultas.component.html',
  styleUrl: './agregar-consultas.component.css'
})
export class AgregarConsultasComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() consultaGuardada = new EventEmitter<any>();

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

    const nuevaConsulta = {
      consulta: this.consulta,
      descripcion: this.descripcion,
      video: this.video,
      producto: this.productoSeleccionado,
      modulo: this.moduloSeleccionado,
      mostrar: this.mostrar
    };
    
    console.log('Nueva consulta:', nuevaConsulta);
    
    // Emitir el evento con los datos de la nueva consulta
    this.consultaGuardada.emit(nuevaConsulta);
    
    // Limpiar formulario
    this.limpiarFormulario();
  }

  onCancelar() {
    this.limpiarFormulario();
    this.cerrarModal();
  }

  private limpiarFormulario() {
    this.consulta = '';
    this.descripcion = '';
    this.video = '';
    this.productoSeleccionado = '';
    this.moduloSeleccionado = '';
    this.mostrar = true;
  }

  private cerrarModal() {
    // Emitir evento para cerrar el modal
    this.cerrar.emit();
  }

  toggleMostrar() {
    this.mostrar = !this.mostrar;
  }
}