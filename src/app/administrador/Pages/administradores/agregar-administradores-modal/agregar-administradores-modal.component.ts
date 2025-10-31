import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdministradorService } from '../../../../service/admin/administrador/administrador.service';


@Component({
  selector: 'app-agregar-administradores-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agregar-administradores-modal.component.html',
  styleUrl: './agregar-administradores-modal.component.css'
})
export class AgregarAdministradoresModalComponent {
  @Output() cerrar = new EventEmitter<void>();
  @Output() creado = new EventEmitter<void>(); // opcional, para refrescar la lista en el padre

  // Modelo del nuevo administrador
  administradorNuevo = {
    nombres: '',
    apellidos: '',
    username: '',
    password: '',
    email: '',
    rolNuevoAdministrador: 1,
  };

  confirmPassword = '';

  constructor(private administradorService: AdministradorService) {}

  

  // Cerrar modal sin guardar
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Guardar administrador
  guardarAdministrador(): void {
      if (this.confirmPassword !== this.administradorNuevo.password) {
    alert('Las contraseñas no coinciden');
    return;
  }
  
    this.administradorService.crearAdministrador(this.administradorNuevo).subscribe({
      next: (res) => {
        console.log('Administrador creado:', res);
        this.creado.emit(); // si deseas que el padre refresque la lista
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al crear administrador:', err);
        alert('Error al crear administrador.');
      }
    });
  }
}
