import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradorService } from '../../../../service/admin/administrador/administrador.service';

@Component({
  selector: 'app-editar-administradores-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-administradores-modal.component.html',
  styleUrls: ['./editar-administradores-modal.component.css']
})
export class EditarAdministradoresModalComponent implements OnInit {
  @Input() administrador: any = {};
  
  // Copia local del administrador para evitar modificar el original
  administradorEditado: any = {
    id: '',
    nombres: '',
    apellidos: '',
    username: '',
    email: '',
    rol: 1,
    passwordActual: '',
    nuevaPassword: '',
    confirmarPassword: ''
  };

  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  // Variable para controlar si se está cambiando la contraseña
  cambiarPassword = false;

  constructor(private administradorService: AdministradorService) {}

  ngOnInit(): void {
    // Crear una copia profunda del administrador recibido
    this.administradorEditado = {
      id: this.administrador.id,
      nombres: this.administrador.nombres || '',
      apellidos: this.administrador.apellidos || '',
      username: this.administrador.username || '',
      email: this.administrador.email || '',
      rol: this.administrador.rol || 1,
      passwordActual: '',
      nuevaPassword: '',
      confirmarPassword: ''
    };
    
    console.log('Administrador original:', this.administrador);
    console.log('Administrador editado (copia):', this.administradorEditado);
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Validación de campos
  validarCampos(): boolean {
    // Validar campos obligatorios
    if (!this.administradorEditado.nombres.trim() || 
        !this.administradorEditado.apellidos.trim() || 
        !this.administradorEditado.username.trim() || 
        !this.administradorEditado.email.trim()) {
      alert('Todos los campos básicos son obligatorios.');
      return false;
    }

    // Validar email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.administradorEditado.email)) {
      alert('El formato del email no es válido.');
      return false;
    }

    // Validar contraseñas si se está cambiando
    if (this.cambiarPassword) {
      if (!this.administradorEditado.passwordActual.trim()) {
        alert('Debe ingresar la contraseña actual para cambiarla.');
        return false;
      }

      if (!this.administradorEditado.nuevaPassword.trim()) {
        alert('Debe ingresar la nueva contraseña.');
        return false;
      }

      if (this.administradorEditado.nuevaPassword.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres.');
        return false;
      }

      if (this.administradorEditado.nuevaPassword !== this.administradorEditado.confirmarPassword) {
        alert('La nueva contraseña y la confirmación no coinciden.');
        return false;
      }
    }

    return true;
  }

  // Método para guardar los cambios en el administrador
  guardarAdministrador(): void {
    if (!this.validarCampos()) {
      return;
    }

    // Si no se está cambiando la contraseña, limpiar los campos
    if (!this.cambiarPassword) {
      this.administradorEditado.passwordActual = '';
      this.administradorEditado.nuevaPassword = '';
      this.administradorEditado.confirmarPassword = '';
    }

    console.log('Datos del administrador a actualizar:', this.administradorEditado);

    try {
      // Llamada al servicio para actualizar el administrador
      this.administradorService.actualizarAdministrador(this.administradorEditado).subscribe({
        next: (res) => {
          console.log('Administrador actualizado exitosamente:', res);
          alert('Administrador actualizado correctamente.');
          this.actualizado.emit(); // Refrescar lista en el padre
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar administrador:', err);
          const mensaje = err.error?.message || err.message || 'Error desconocido al actualizar administrador.';
          alert('Error: ' + mensaje);
        }
      });
    } catch (error: any) {
      alert('Error de validación: ' + error.message);
    }
  }
}