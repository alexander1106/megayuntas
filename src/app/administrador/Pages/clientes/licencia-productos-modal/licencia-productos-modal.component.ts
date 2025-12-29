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

// ⭐ Interfaz actualizada para soportar ID string (encriptado)
export interface ClienteConLicencias {
  id: string; // Cambiado de number a string
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
    // Inicialización segura de licencias
    if (this.cliente && !this.cliente.licencias) {
      this.cliente.licencias = [];
    }
  }

  // Verificar si hay datos de cliente cargados
  get clienteValido(): boolean {
    return this.cliente !== null && this.cliente !== undefined;
  }

  get licenciasCliente(): Licencia[] {
    return this.cliente?.licencias || [];
  }

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
      // Ejemplo de creación de licencia localmente
      const nuevaLicencia: Licencia = {
        sistema: 'NUEVO_SISTEMA',
        fechInstalacion: new Date().toLocaleDateString('es-PE'),
        fechActualizacion: new Date().toLocaleDateString('es-PE'),
        version: '1.0.0',
        usuarioLic: 1,
        nroSerieLicencia: 'GEN-' + Date.now().toString().slice(-6), // Generación simple de serie
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
    console.log('Editar licencia:', licencia);
    // Aquí puedes implementar lógica para abrir un sub-modal o editar en línea
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
    console.log('Descargando archivo para licencia:', licencia.nroSerieLicencia);
    // Aquí conectarías con tu servicio para descargar el archivo real
  }
}