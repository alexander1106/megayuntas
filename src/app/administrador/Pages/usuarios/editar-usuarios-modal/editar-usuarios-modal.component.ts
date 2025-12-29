import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../../service/admin/usuario/usuarios.service';

@Component({
  selector: 'app-editar-usuarios-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './editar-usuarios-modal.component.html',
  styleUrl: './editar-usuarios-modal.component.css'
})
export class EditarUsuariosModalComponent implements OnInit {
  
  // Recibe el objeto usuario desde el padre (el ID viene como string encriptado)
  @Input() usuario: any = {};
  
  // Modelo local para el formulario
  usuarioEditado: any = {
    id: '', // Se inicializa como string para soportar el hash
    nombres: '',
    apellidos: '',
    email: ''
  };

  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    // Verificamos que llegue data para evitar errores de undefined
    if (this.usuario) {
      this.usuarioEditado = {
        id: this.usuario.id, // Copia el ID encriptado (ej: "abc-123")
        nombres: this.usuario.nombres || '',
        apellidos: this.usuario.apellidos || '',
        email: this.usuario.email || ''
      };
    }
    console.log('Editando usuario (ID Encriptado):', this.usuarioEditado.id);
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarUsuario(): void {
    // 1. Validaciones
    if (!this.usuarioEditado.nombres.trim() || 
        !this.usuarioEditado.apellidos.trim() || 
        !this.usuarioEditado.email.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // 2. Enviar al servicio
    // El servicio espera el objeto con el 'id' encriptado dentro del body
    this.usuariosService.actualizarUsuario(this.usuarioEditado).subscribe({
      next: () => {
        // No mostramos alert intrusivo si no es necesario, o usa un Toast aquí
        console.log('Usuario actualizado correctamente');
        this.actualizado.emit(); // Avisar al padre para recargar la tabla
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        // Muestra mensaje de error del backend si existe
        const msg = err.error?.message || 'Error desconocido al actualizar';
        alert(`Error: ${msg}`);
      }
    });
  }
}