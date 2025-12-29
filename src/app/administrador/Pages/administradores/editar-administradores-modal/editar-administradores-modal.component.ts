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
  
  administradorEditado: any = {
    id: '',  //  Este será el ID ENCRIPTADO
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

  cambiarPassword = false;

  constructor(private administradorService: AdministradorService) {}

  ngOnInit(): void {
    // ⭐ El ID que recibimos ya está encriptado desde el backend
    this.administradorEditado = {
      id: this.administrador.id,  // ID encriptado
      nombres: this.administrador.nombres || '',
      apellidos: this.administrador.apellidos || '',
      username: this.administrador.username || '',
      email: this.administrador.email || '',
      rol: this.administrador.rol || 1,
      passwordActual: '',
      nuevaPassword: '',
      confirmarPassword: ''
    };
    
    console.log('Admin con ID encriptado:', this.administrador.id);
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  validarCampos(): boolean {
    if (!this.administradorEditado.nombres.trim() || 
        !this.administradorEditado.apellidos.trim() || 
        !this.administradorEditado.username.trim() || 
        !this.administradorEditado.email.trim()) {
      alert('Todos los campos básicos son obligatorios.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.administradorEditado.email)) {
      alert('El formato del email no es válido.');
      return false;
    }

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

  guardarAdministrador(): void {
    if (!this.validarCampos()) {
      return;
    }

    if (!this.cambiarPassword) {
      this.administradorEditado.passwordActual = '';
      this.administradorEditado.nuevaPassword = '';
      this.administradorEditado.confirmarPassword = '';
    }

    console.log('Guardando admin con ID encriptado:', this.administradorEditado.id);

    try {
      // ⭐ El ID ya está encriptado, se envía tal cual
      this.administradorService.actualizarAdministrador(this.administradorEditado).subscribe({
        next: (res) => {
          console.log('Administrador actualizado exitosamente:', res);
          alert('Administrador actualizado correctamente.');
          this.actualizado.emit();
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