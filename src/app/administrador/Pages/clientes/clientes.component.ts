// src/app/components/clientes/clientes.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgregarClienteModalComponent } from './agregar-cliente-modal/agregar-cliente-modal.component';
import { EditarClienteModalComponent } from './editar-cliente-modal/editar-cliente-modal.component';
import { EliminarClienteModalComponent } from './eliminar-cliente-modal/eliminar-cliente-modal.component';
import { LicenciaModalComponent, ClienteConLicencias } from './licencia-productos-modal/licencia-productos-modal.component';
import { ClientesService, Cliente } from '../../../service/admin/clientes/clientes.service';

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
  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalLicencias = false;
  clienteIdAEliminar: number | null = null;

  // Estado del componente
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  clienteConLicencias: ClienteConLicencias | null = null;
  cargandoClientes = false;
  errorCarga = false;

  constructor(private clientesSvc: ClientesService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  // Método corregido para cargar clientes
  cargarClientes(): void {
    this.cargandoClientes = true;
    this.errorCarga = false;
    
    this.clientesSvc.getClientes().subscribe({
      next: (data: Cliente[]) => {
        console.log('Clientes cargados:', data);
        this.clientes = data;
        this.cargandoClientes = false;
      },
      error: (err) => {
        console.error('Error al cargar clientes:', err);
        this.errorCarga = true;
        this.cargandoClientes = false;
        
        // Opcional: Mostrar mensaje de error al usuario
        // this.mostrarMensajeError('No se pudieron cargar los clientes');
      },
      complete: () => {
        console.log('Carga de clientes completada');
      }
    });
  }

  // Método para recargar clientes (útil para botón de recarga)
  recargarClientes(): void {
    this.cargarClientes();
  }

  // —————————— AGREGAR ——————————
  abrirModalAgregar(): void {
    this.mostrarModalAgregar = true;
  }

  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false;
    // Recargar clientes después de agregar
    this.cargarClientes();
  }

  // —————————— EDITAR ——————————
  abrirModalEditar(cliente: Cliente): void {
    this.clienteSeleccionado = { ...cliente }; // Crear copia para evitar mutaciones
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.clienteSeleccionado = null;
    // Recargar clientes después de editar
    this.cargarClientes();
  }

  // —————————— ELIMINAR ——————————
  abrirModalEliminar(clienteId: number): void {
    this.clienteIdAEliminar = clienteId;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.clienteIdAEliminar = null;
  }

  // Método corregido para eliminar cliente
  eliminarCliente(clienteId: number): void {
    this.clientesSvc.eliminarCliente(clienteId).subscribe({
      next: () => {
        console.log('Cliente eliminado correctamente');
        // Actualizar la lista local
        this.clientes = this.clientes.filter(c => c.id !== clienteId);
        this.cerrarModalEliminar();
      },
      error: (err) => {
        console.error('Error al eliminar cliente:', err);
        // Opcional: mostrar mensaje de error
      }
    });
  }

  // —————————— LICENCIAS ——————————
  abrirModalLicencias(cliente: Cliente): void {
    // Convertir Cliente a ClienteConLicencias
    this.clienteConLicencias = {
      ...cliente,
      licencias: this.obtenerLicenciasCliente(cliente.id),
      // Mapear propiedades si tienen nombres diferentes
      Grupo: cliente.grupo,
      mostrarEnWeb: String(cliente.mostrarEnWeb)
    };
    this.mostrarModalLicencias = true;
  }

  cerrarModalLicencias(): void {
    this.mostrarModalLicencias = false;
    this.clienteConLicencias = null;
  }

  guardarLicencias(cliente: ClienteConLicencias): void {
    console.log('Guardando licencias para cliente:', cliente);
    
    // Implementar cuando tengas el endpoint
    // this.clientesSvc.actualizarLicencias(cliente.id, cliente.licencias).subscribe({
    //   next: () => {
    //     console.log('Licencias actualizadas correctamente');
    //     this.cargarClientes();
    //   },
    //   error: (err) => console.error('Error al actualizar licencias', err)
    // });
    
    this.cerrarModalLicencias();
  }

  descargarReporte(): void {
  this.clientesSvc.reporteClientes().subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_clientes.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  });
  }

  // —————————— MÉTODOS AUXILIARES ——————————
  
  // Método para obtener licencias del cliente (temporal)
  private obtenerLicenciasCliente(clienteId: number) {
    // Datos de ejemplo mientras implementas el servicio real
    const licenciasEjemplo = [
      {
        sistema: 'YUPAY',
        fechInstalacion: '01/04/2025',
        fechActualizacion: '24/03/2025',
        version: '2.2.32',
        usuarioLic: 5,
        nroSerieLicencia: `BRWN-BP3Y-C5NF-KXYF-4TGK-6C5B-${clienteId}`,
        status: 'Vigente',
        licActiva: 'Activa'
      },
      {
        sistema: 'CONTABILIDAD',
        fechInstalacion: '15/03/2025',
        fechActualizacion: '20/03/2025',
        version: '3.1.5',
        usuarioLic: 3,
        nroSerieLicencia: `CONT-XY2Z-A1B2-C3D4-E5F6-${clienteId}`,
        status: 'Vigente',
        licActiva: 'Activa'
      }
    ];

    return licenciasEjemplo;
  }

  // Método para buscar cliente por ID
  obtenerClientePorId(id: number): Cliente | undefined {
    return this.clientes.find(cliente => cliente.id === id);
  }

  // Método para filtrar clientes (útil para implementar búsqueda)
  filtrarClientes(termino: string): Cliente[] {
    if (!termino) return this.clientes;
    
    return this.clientes.filter(cliente =>
      cliente.nombreEmpresa.toLowerCase().includes(termino.toLowerCase()) ||
      cliente.ruc.includes(termino) ||
      cliente.contacto.toLowerCase().includes(termino.toLowerCase())
    );
  }
}