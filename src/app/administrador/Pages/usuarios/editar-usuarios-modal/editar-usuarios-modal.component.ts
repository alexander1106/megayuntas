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
  // Recibe el usuario a editar
  @Input() usuario: any = {};
  
  // Copia local del usuario para evitar modificar el original
  usuarioEditado: any = {
    id: '',
    nombres: '',
    apellidos: '',
    email: ''
  };

  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizado = new EventEmitter<void>();

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    // Crear una copia profunda del usuario recibido
    this.usuarioEditado = {
      id: this.usuario.id,
      nombres: this.usuario.nombres || '',
      apellidos: this.usuario.apellidos || '',
      email: this.usuario.email || ''
    };
    
    console.log('Usuario original:', this.usuario);
    console.log('Usuario editado (copia):', this.usuarioEditado);
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.cerrar.emit();
  }

  // Método para guardar los cambios en el usuario
  guardarUsuario(): void {
    // Validar que los campos no estén vacíos
    if (!this.usuarioEditado.nombres.trim() || !this.usuarioEditado.apellidos.trim() || !this.usuarioEditado.email.trim()) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    console.log('Datos del usuario a actualizar:', this.usuarioEditado); // Debug
    
    // Llamada al servicio para actualizar el usuario
    this.usuariosService.actualizarUsuario(this.usuarioEditado).subscribe({
      next: (res) => {
        console.log('Usuario actualizado exitosamente:', res);
        this.actualizado.emit(); // Refrescar lista en el padre
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        alert('Error al actualizar usuario: ' + (err.error?.message || err.message));
      }
    });
  }
}