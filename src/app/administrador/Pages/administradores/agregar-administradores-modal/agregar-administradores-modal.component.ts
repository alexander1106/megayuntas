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
  @Output() creado = new EventEmitter<void>();

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

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarAdministrador(): void {
    if (this.confirmPassword !== this.administradorNuevo.password) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    this.administradorService.crearAdministrador(this.administradorNuevo).subscribe({
      next: (res) => {
        // ⭐ La respuesta contiene el ID ENCRIPTADO: { idAdministrador: "Xy9-zRq2" }
        console.log('Administrador creado con ID encriptado:', res.idAdministrador);
        this.creado.emit();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al crear administrador:', err);
        alert('Error al crear administrador.');
      }
    });
  }
}