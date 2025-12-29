import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Servicios
import { AdministradorService } from '../../../service/admin/administrador/administrador.service';
// Modales
import { AgregarAdministradoresModalComponent } from './agregar-administradores-modal/agregar-administradores-modal.component';
import { EliminarAdministradoresModalComponent } from './eliminar-administradores-modal/eliminar-administradores-modal.component';
import { EditarAdministradoresModalComponent } from './editar-administradores-modal/editar-administradores-modal.component';

@Component({
  selector: 'app-administradores',
  standalone: true,
  templateUrl: './administradores.component.html',
  styleUrls: ['./administradores.component.css'],
  imports: [
    CommonModule, 
    AgregarAdministradoresModalComponent,
    EditarAdministradoresModalComponent, 
    EliminarAdministradoresModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdministradoresComponent implements OnInit {
  administradorSeleccionado: any;
  admins: any[] = [];

  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  
  // ⭐ ID encriptado es string
  adminsIdAEliminar: string | null = null;

  constructor(private administradorService: AdministradorService) {}

  ngOnInit(): void {
    this.cargarAdministradores();
  }

  cargarAdministradores(): void {
    this.administradorService.getAdministradores().subscribe({
      next: (data) => {
        // Asumiendo que data ya trae el formato correcto del backend
        this.admins = data;
      },
      error: (err) => console.error('Error al cargar administradores', err)
    });
  }

  trackByAdminId(index: number, admin: any): string {
    return admin.id; 
  }

  // --- AGREGAR ---
  abrirModalAgregar() { this.mostrarModalAgregar = true; }
  
  cerrarModalAgregar() {
    this.mostrarModalAgregar = false;
    this.cargarAdministradores();
  }

  // --- EDITAR ---
  abrirModalEditar(admin: any): void {
    this.administradorSeleccionado = { ...admin }; // Copia segura
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.administradorSeleccionado = null;
    this.cargarAdministradores();
  }

  // --- ELIMINAR ---
  abrirModalEliminar(id: string) { // ⭐ Recibe String
    this.adminsIdAEliminar = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar() {
    this.mostrarModalEliminar = false;
    this.adminsIdAEliminar = null;
  }

  eliminarAdministrador(id: string): void { // ⭐ Recibe String
    if (!id) return;

    this.administradorService.eliminarAdministrador(id).subscribe({
      next: () => {
        this.cerrarModalEliminar();
        this.cargarAdministradores();
      },
      error: (err) => console.error('Error al eliminar:', err)
    });
  }
}