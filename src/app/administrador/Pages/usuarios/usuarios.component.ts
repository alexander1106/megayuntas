import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

// Asegúrate de que las rutas sean correctas según tu estructura
import { EliminarUsuariosModalComponent } from './eliminar-usuarios-modal/eliminar-usuarios-modal.component';
import { UsuariosService } from '../../service/admin/usuario/usuario.service'; // Ajusta la ruta si es necesario
import { EditarUsuariosModalComponent } from './editar-usuarios-modal/editar-usuarios-modal.component';

// CAMBIO 1: La interfaz ahora define id como string
interface Usuario {
  id: string; // <-- Antes number, ahora string (hash encriptado)
  nombres: string;
  apellidos: string;
  email: string;
  idRol: number | string; // Puede ser número al llegar, string al mapear
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

  readonly rolesMap: { [key: string]: string } = {
    '3': 'Usuario',
    '2': 'Administrador', // Ejemplo
    '1': 'SuperAdmin'     // Ejemplo
  };

  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  
  usuarioSeleccionado: Usuario | null = null;
  
  // CAMBIO 2: La variable para eliminación ahora es string
  usuarioIdAEliminar: string | null = null; 

  idRol = "Usuario"; 

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: res => {
        console.log('Datos recibidos:', res);
        // Mapeamos los datos asegurando que la estructura coincida
        this.usuarios = res.map((usuario: any) => ({
          ...usuario,
          // Si el backend envía "idUsuario", lo asignamos a "id", si envía "id", se queda igual
          id: usuario.id || usuario.idUsuario, 
          idRol: this.rolesMap[usuario.idRol] || usuario.idRol
        }));
      },
      error: err => console.error('Error al cargar usuarios', err)
    });
  }

  // CAMBIO 3: TrackBy ahora retorna string
  trackByUsuarioId(index: number, usuario: Usuario): string {
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
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModalEditar = true;
  }
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.usuarioSeleccionado = null;
    this.cargarUsuarios();
  }

  // --- ELIMINAR ---
  // CAMBIO 4: Recibe string en lugar de number
  abrirModalEliminar(usuarioId: string): void {
    this.usuarioIdAEliminar = usuarioId;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.usuarioIdAEliminar = null;
  }

  // CAMBIO 5: Lógica de eliminación adaptada a string
  eliminarUsuario(id: string): void {
    if (!id) {
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
        // Aquí podrías agregar una alerta visual (Toaster/SweetAlert)
      }
    });
  }
}