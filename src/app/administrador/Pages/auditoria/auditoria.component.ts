import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerDetalleAuditoriaModalComponent } from '../detalles-auditoria/ver-detalle-auditoria-modal.component';

import { AuditoriaService } from '../../../service/admin/auditoria/auditoria.service';
@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule, VerDetalleAuditoriaModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.css']
})
export class AuditoriaComponent implements OnInit {
  
  auditorias: any[] = [];          
  auditoriasFiltradas: any[] = []; 
  auditoriasPaginadas: any[] = []; 

  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  totalPaginas: number = 1;

  textoBusqueda: string = '';
  cargando: boolean = false;

  mostrarModalDetalle: boolean = false;
  auditoriaSeleccionada: any = null;
  // 👇 2. INYECTA EL SERVICIO AQUÍ
  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarAuditorias();
  }

  cargarAuditorias() {
    this.cargando = true;

    // 👇 3. LLAMADA REAL AL BACKEND
    this.auditoriaService.getAuditorias().subscribe({
      next: (data) => {
        console.log('Datos de auditoría recibidos:', data); // Para depurar
        this.auditorias = data;
        this.filtrar(); // Inicializa la tabla
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar auditoría:', err);
        this.cargando = false;
        // Opcional: Mostrar alerta de error
      }
    });
  }

  filtrar() {
    const texto = this.textoBusqueda.toLowerCase().trim();

    if (!texto) {
      this.auditoriasFiltradas = [...this.auditorias];
    } else {
      this.auditoriasFiltradas = this.auditorias.filter(item => {
        // Aseguramos que los campos existan antes de hacer lowerCase para evitar errores
        const usuario = item.usuario || '';
        const accion = item.accion || '';
        const descripcion = item.descripcion || ''; // A veces el backend llama a esto 'mensaje' o 'details'

        return usuario.toLowerCase().includes(texto) ||
               accion.toLowerCase().includes(texto) ||
               descripcion.toLowerCase().includes(texto);
      });
    }

    this.paginaActual = 1;
    this.calcularPaginacion();
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.filtrar();
  }

  calcularPaginacion() {
    this.totalPaginas = Math.ceil(this.auditoriasFiltradas.length / this.itemsPorPagina) || 1;
    this.actualizarVistaPagina();
  }

  actualizarVistaPagina() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.auditoriasPaginadas = this.auditoriasFiltradas.slice(inicio, fin);
  }

  cambiarPagina(delta: number) {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.actualizarVistaPagina();
    }
  }

  abrirModalDetalle(audit: any) {
    this.auditoriaSeleccionada = audit;
    this.mostrarModalDetalle = true;
  }

  cerrarModalDetalle() {
    this.mostrarModalDetalle = false;
    this.auditoriaSeleccionada = null;
  }
}