import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modales
import { AgregarClienteModalComponent } from './agregar-cliente-modal/agregar-cliente-modal.component';
import { EditarClienteModalComponent } from './editar-cliente-modal/editar-cliente-modal.component';
import { EliminarClienteModalComponent } from './eliminar-cliente-modal/eliminar-cliente-modal.component';
import { LicenciaModalComponent } from './licencia-productos-modal/licencia-productos-modal.component';
import { ClientesService } from '../../../service/admin/clientes/clientes.service';
import { Cliente } from '../../../service/pages/clientes/clientes.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    AgregarClienteModalComponent,
    EditarClienteModalComponent,
    EliminarClienteModalComponent,
    LicenciaModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  cargandoClientes = false;

  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalLicencias = false;

  clienteSeleccionado: Cliente | null = null;

  // ⭐ String ID
  clienteIdAEliminar: string | null = null;
abrirModalLicencias: any;

  constructor(private clientesSvc: ClientesService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargandoClientes = true;
    this.clientesSvc.getClientes().subscribe({
      next: (data:any) => {
        this.clientes = data;
        this.cargandoClientes = false;
      },
      error: (err:any) => {
        console.error('Error al cargar clientes', err);
        this.cargandoClientes = false;
      }
    });
  }

  // --- Modales ---
  abrirModalAgregar(): void { this.mostrarModalAgregar = true; }
  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false;
    this.cargarClientes();
  }

  abrirModalEditar(cliente: Cliente): void {
    this.clienteSeleccionado = { ...cliente };
    this.mostrarModalEditar = true;
  }
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.clienteSeleccionado = null;
    this.cargarClientes();
  }
  descargarReporte() {
    console.log('Descargando reporte...');
    // aquí va la lógica real para descargar
  }

  abrirModalEliminar(id: string): void { // ⭐ String
    this.clienteIdAEliminar = id;
    this.mostrarModalEliminar = true;
  }
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.clienteIdAEliminar = null;
  }

  eliminarCliente(id: string): void { // ⭐ String
    this.clientesSvc.eliminarCliente(id).subscribe({
      next: () => {
this.clientes = this.clientes.filter(c => c.id !== Number(id));
        this.cerrarModalEliminar();
      },
      error: (err) => console.error(err)
    });
  }
}
