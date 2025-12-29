import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../../service/admin/clientes/clientes.service'; // Ajusta la ruta

@Component({
  selector: 'app-editar-cliente-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './editar-cliente-modal.component.html',
  styleUrl: './editar-cliente-modal.component.css'
})
export class EditarClienteModalComponent implements OnInit {
  @Input() clienteData: any = null; // Recibe el cliente a editar
  @Output() cerrar = new EventEmitter<void>();
  
  // Modelo local
  cliente: any = {
    id: '', // ⭐ String (Hash)
    empresa: '',
    opinion: '',
    ruc: '',
    telefono: '',
    contacto: '',
    direccion: '',
    localidad: '',
    nombreComercial: '',
    grupo: '',
    mostrarWeb: false
  };

  constructor(private clientesService: ClientesService) {}

  ngOnInit(): void {
    // Cargar datos recibidos en el modelo local
    if (this.clienteData) {
      this.cliente = {
        id: this.clienteData.id,
        empresa: this.clienteData.nombreEmpresa, // Mapeo de nombre
        ruc: this.clienteData.ruc,
        telefono: this.clienteData.telefono,
        contacto: this.clienteData.contacto,
        grupo: this.clienteData.grupo,
        mostrarWeb: this.clienteData.mostrarEnWeb,
        // Mapea los demás campos si vienen del backend
        direccion: this.clienteData.direccion || '',
        opinion: this.clienteData.opinion || '',
        localidad: this.clienteData.localidad || '',
        nombreComercial: this.clienteData.nombreComercial || ''
      };
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarCliente(): void {
    // Preparar DTO para el servicio
    const clienteActualizadoDTO = {
      id: this.cliente.id, // ID encriptado
      nombreEmpresa: this.cliente.empresa,
      ruc: this.cliente.ruc,
      telefono: this.cliente.telefono,
      contacto: this.cliente.contacto,
      grupo: this.cliente.grupo,
      mostrarEnWeb: this.cliente.mostrarWeb,
      // Otros campos...
    };

    console.log('Actualizando cliente:', clienteActualizadoDTO);

    this.clientesService.actualizarCliente(clienteActualizadoDTO).subscribe({
      next: (res) => {
        console.log('Cliente actualizado:', res);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar el cliente');
      }
    });
  }

  consultarRUC(): void {
    console.log('Consultando RUC:', this.cliente.ruc);
  }

  subirImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      console.log('Imagen seleccionada:', input.files[0].name);
    }
  }
}