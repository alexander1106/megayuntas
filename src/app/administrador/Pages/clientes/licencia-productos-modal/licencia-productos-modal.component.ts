import { Component, Input, Output, EventEmitter, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Licencia {
  sistema: string;
  fechInstalacion: string;
  fechActualizacion: string;
  version: string;
  usuarioLic: number;
  nroSerieLicencia: string;
  status: string;
  licActiva: string;
}

// Extendemos tu interfaz Cliente existente
export interface ClienteConLicencias {
  id: number;
  nombreEmpresa: string;
  ruc: string;
  telefono: string;
  contacto: string;
  Grupo: string;
  mostrarEnWeb: string;
  licencias?: Licencia[];
}


@Component({
  selector: 'app-licencia-productos-modal',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './licencia-productos-modal.component.html',
  styleUrl: './licencia-productos-modal.component.css'
})
export class LicenciaModalComponent implements OnInit {
  @Input() cliente: ClienteConLicencias | null = null;
  @Input() mostrar: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<ClienteConLicencias>();

  constructor() { }

  ngOnInit(): void {
    // Si el cliente no tiene licencias, inicializar con array vacío
    if (this.cliente && !this.cliente.licencias) {
      this.cliente.licencias = [];
    }
  }

  // Getter para verificar si el cliente existe
  get clienteValido(): boolean {
    return this.cliente !== null && this.cliente !== undefined;
  }

  get licenciasCliente(): Licencia[] {
    return this.cliente?.licencias || [];
  }

  // TrackBy function para mejorar performance en *ngFor
  trackByLicencia(index: number, licencia: Licencia): string {
    return licencia.nroSerieLicencia;
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  guardarCambios(): void {
    if (this.cliente) {
      this.guardar.emit(this.cliente);
    }
  }

  agregarLicencia(): void {
    if (this.cliente) {
      // Agregar una licencia de ejemplo o abrir un formulario
      const nuevaLicencia: Licencia = {
        sistema: 'NUEVO_SISTEMA',
        fechInstalacion: new Date().toLocaleDateString('es-PE'),
        fechActualizacion: new Date().toLocaleDateString('es-PE'),
        version: '1.0.0',
        usuarioLic: 1,
        nroSerieLicencia: 'NUEVA-LICENCIA-' + Date.now(),
        status: 'Vigente',
        licActiva: 'Activa'
      };
      
      if (!this.cliente.licencias) {
        this.cliente.licencias = [];
      }
      this.cliente.licencias.push(nuevaLicencia);
    }
  }

  editarLicencia(licencia: Licencia): void {
    // Lógica para editar licencia
    console.log('Editar licencia:', licencia);
    // Aquí podrías abrir otro modal o hacer la edición inline
  }

  eliminarLicencia(licencia: Licencia): void {
    if (this.cliente && confirm('¿Está seguro de eliminar esta licencia?')) {
      if (this.cliente.licencias) {
        this.cliente.licencias = this.cliente.licencias.filter(
          l => l.nroSerieLicencia !== licencia.nroSerieLicencia
        );
      }
    }
  }

  descargarLicencia(licencia: Licencia): void {
    // Lógica para descargar licencia
    console.log('Descargar licencia:', licencia);
    // Aquí implementarías la descarga del archivo de licencia
  }
}