import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { EliminarUsuariosModalComponent } from './eliminar-usuarios-modal/eliminar-usuarios-modal.component';
import { UsuariosService } from '../../../service/admin/usuario/usuarios.service';
import { EditarUsuariosModalComponent } from './editar-usuarios-modal/editar-usuarios-modal.component';



interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  idRol: number;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    EditarUsuariosModalComponent,
    EliminarUsuariosModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  // Mapeo de roles para mostrar nombres legibles
  readonly rolesMap: { [key: string]: string } = {
    '3': 'Usuario',
    // Puedes agregar más roles aquí si es necesario
  };
  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  usuarioSeleccionado: Usuario | null = null;
  usuarioIdAEliminar: number | null = null;
  idRol = "Usuario"; // Asignar el perfil por defecto


  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: res => {
        console.log('Datos recibidos del servicio:', res); // Debug
        // Mapear idRol a nombre legible si corresponde
        this.usuarios = res.map((usuario: Usuario) => ({
          ...usuario,
          idRol: this.rolesMap[usuario.idRol] || usuario.idRol
        }));
        console.log('Usuarios procesados:', this.usuarios); // Debug
      },
      error: err => console.error('Error al cargar usuarios', err)
    });
  }

  // TrackBy function para mejorar el rendimiento
  trackByUsuarioId(index: number, usuario: Usuario): number {
    return usuario.id;
  }

  // --- AGREGAR ---
  abrirModalAgregar(): void {
    this.mostrarModalAgregar = true;
  }
  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false;
    this.cargarUsuarios();
  }

  // --- EDITAR ---
  abrirModalEditar(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario }; // clonamos para no mutar directo
    this.mostrarModalEditar = true;
  }
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.usuarioSeleccionado = null;
    this.cargarUsuarios();
  }

  // --- ELIMINAR ---
  abrirModalEliminar(usuarioId: number): void {
    this.usuarioIdAEliminar = usuarioId;
    this.mostrarModalEliminar = true;
  }
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.usuarioIdAEliminar = null;
  }
  eliminarUsuario(id: number): void {
    if (id == null || id === undefined) {
    console.error('ID inválido para eliminación');
    return;
  }

  this.usuariosService.eliminarUsuario(id).subscribe({
    next: () => {
      console.log(`Usuario con ID ${id} eliminado`);
      this.cerrarModalEliminar();
      this.cargarUsuarios();
    },
    error: (err) => {
      console.error('Error al eliminar Usuario:', err);
    }
  });
}
}