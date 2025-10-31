import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { AdministradorService } from '../../../service/admin/administrador/administrador.service';
import { CommonModule } from '@angular/common';
import { AgregarAdministradoresModalComponent } from './agregar-administradores-modal/agregar-administradores-modal.component';
import { EliminarAdministradoresModalComponent } from './eliminar-administradores-modal/eliminar-administradores-modal.component';
import { EditarAdministradoresModalComponent } from './editar-administradores-modal/editar-administradores-modal.component';


@Component({
  selector: 'app-administradores',
  standalone: true,
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css'],
  imports: [CommonModule,AgregarAdministradoresModalComponent,
              EditarAdministradoresModalComponent, EliminarAdministradoresModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdministradoresComponent implements OnInit {

    // Propiedad para almacenar el administrador seleccionado
  administradorSeleccionado: any;

  admins: any[] = [];

  // Modales (si los usas luego)
  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  adminsIdAEliminar: number | null = null;

  constructor(private administradorService: AdministradorService) {}

  ngOnInit(): void {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.administradorService.getAdministradores().subscribe({
      next: (data) => {
        console.log('Datos recibidos del servicio:', data); // Debug
        this.admins = data.map((a: any) => ({
          id: a.id,
          nombre: a.nombres,
          username: a.username,
          apellido: a.apellidos,
          email: a.email,
          perfil: a.rol,
        }));
        console.log('Administradores procesados:', this.admins); // Debug
      },
      error: (err) => {
        console.error('Error al cargar administradores', err);
      }
    });
  }

  // TrackBy function para mejorar el rendimiento
  trackByAdminId(index: number, admin: any): number {
    return admin.id;
  }

  // Métodos para abrir/cerrar modales
  abrirModalAgregar() {
    this.mostrarModalAgregar = true;
  }

  cerrarModalAgregar() {
    this.mostrarModalAgregar = false;
    // Recargar datos después de agregar
    this.cargarAdministradores();
  }

abrirModalEditar(admin: any): void {
  this.administradorSeleccionado = admin;
  this.mostrarModalEditar = true;
}

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    // Recargar datos después de editar
    this.cargarAdministradores();
  }

  abrirModalEliminar(id: number) {
    this.mostrarModalEliminar = true;
    this.adminsIdAEliminar = id;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.adminsIdAEliminar = null;
  }

eliminarAdministrador(id: number): void {
  if (id == null || id === undefined) {
    console.error('ID inválido para eliminación');
    return;
  }

  this.administradorService.eliminarAdministrador(id).subscribe({
    next: () => {
      console.log(`Administrador con ID ${id} eliminado`);
      this.cerrarModalEliminar();
      this.cargarAdministradores();
    },
    error: (err) => {
      console.error('Error al eliminar administrador:', err);
    }
  });
}
}