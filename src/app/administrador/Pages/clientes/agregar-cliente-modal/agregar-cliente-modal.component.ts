import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../../service/admin/clientes/clientes.service'; // Ajusta la ruta

@Component({
  selector: 'app-agregar-cliente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './agregar-cliente-modal.component.html',
})
export class AgregarClienteModalComponent {
  @Output() cerrar = new EventEmitter<void>();
  
  // Modelo del formulario
  clienteNuevo = {
    empresa: '',
    ruc: '',
    telefono: '',
    contacto: '',
    grupo: '',
    mostrarWeb: false,
    // Campos adicionales si tu backend los soporta:
    opinion: '',
    direccion: '',
    localidad: '',
    nombreComercial: ''
  };

  constructor(private clientesService: ClientesService) {}

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarCliente(): void {
    // Validar campos requeridos básicos
    if (!this.clienteNuevo.empresa || !this.clienteNuevo.ruc) {
      alert('Nombre de empresa y RUC son obligatorios');
      return;
    }

    // Mapeo al DTO que espera el servicio (Interfaz Cliente)
    const nuevoClienteDTO = {
      nombreEmpresa: this.clienteNuevo.empresa,
      ruc: this.clienteNuevo.ruc,
      telefono: this.clienteNuevo.telefono,
      contacto: this.clienteNuevo.contacto,
      grupo: this.clienteNuevo.grupo,
      mostrarEnWeb: this.clienteNuevo.mostrarWeb,
      // Si tu backend acepta los otros campos, agrégalos aquí:
      // direccion: this.clienteNuevo.direccion,
      // ...
    };

    console.log('Enviando cliente:', nuevoClienteDTO);

    this.clientesService.crearCliente(nuevoClienteDTO).subscribe({
      next: (res) => {
        console.log('Cliente creado:', res);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al crear cliente:', err);
        alert('Error al guardar el cliente');
      }
    });
  }

  consultarRUC(): void {
    console.log('Consultando RUC:', this.clienteNuevo.ruc);
    // Aquí puedes integrar un servicio de consulta de RUC externa si lo tienes
  }

  subirImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Imagen seleccionada:', input.files[0].name);
      // Lógica de subida de imagen
    }
  }
}