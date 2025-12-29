import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultasService, Consulta } from '../../../service/consultas/consultas.service'; // Asegúrate de esta ruta
// Modales
import { AgregarConsultasComponent } from './agregar-consultas/agregar-consultas.component';
import { EditarConsultasComponent } from './editar-consultas/editar-consultas.component';
import { EliminarConsultasComponent } from './eliminar-consultas/eliminar-consultas.component';
import { RelacionarConsultasComponent } from './relacionar-consultas/relacionar-consultas.component';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [
    CommonModule,
    AgregarConsultasComponent,
    EditarConsultasComponent,
    EliminarConsultasComponent,
    RelacionarConsultasComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.css',
})
export class ConsultasComponent implements OnInit {
  consultas: Consulta[] = [];
  cargando = false;

  // Modales
  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  mostrarModalRelacionar = false;

  // IDs ahora son strings
  consultaIdAEliminar: string | null = null;
  consultaIdAEditar: string | null = null;
  consultaIdARelacionar: string | null = null;
  consultaSeleccionada: Consulta | null = null;

  // Paginación
  paginaActual = 1;
  itemsPorPagina = 10;
  Math = Math;

  constructor(private consultasService: ConsultasService) {}

  ngOnInit(): void {
    this.cargarConsultas();
  }

  cargarConsultas(): void {
    this.cargando = true;
    this.consultasService.listarConsultas().subscribe({
      next: (data) => {
        this.consultas = data;
        this.cargando = false;
        // Reiniciar paginación si es necesario
        if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
          this.paginaActual = this.totalPaginas;
        }
      },
      error: (err) => {
        console.error('Error al cargar consultas:', err);
        this.cargando = false;
      }
    });
  }

  // --- Getters Paginación ---
  get totalPaginas(): number {
    return Math.ceil(this.consultas.length / this.itemsPorPagina);
  }

  get consultasPaginadas(): Consulta[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    return this.consultas.slice(inicio, fin);
  }

  get numerosPaginas(): number[] {
    const total = this.totalPaginas;
    const actual = this.paginaActual;
    const numeros: number[] = [];
    let inicio = Math.max(1, actual - 2);
    const fin = Math.min(total, inicio + 4);
    if (fin - inicio < 4) inicio = Math.max(1, fin - 4);
    for (let i = inicio; i <= fin; i++) numeros.push(i);
    return numeros;
  }

  // --- Navegación ---
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) this.paginaActual--;
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) this.paginaActual++;
  }

  // --- MÉTODOS MODALES ---

  // AGREGAR
  abrirModalAgregar(): void { this.mostrarModalAgregar = true; }
  cerrarModalAgregar(): void { 
    this.mostrarModalAgregar = false;
    this.cargarConsultas();
  }

  // EDITAR
  abrirModalEditar(consultaId: string): void { // ⭐ String
    this.consultaIdAEditar = consultaId;
    // Buscar el objeto completo si es necesario para el modal
    const found = this.consultas.find(c => c.id === consultaId);
    if (found) this.consultaSeleccionada = found;
    this.mostrarModalEditar = true;
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.consultaIdAEditar = null;
    this.consultaSeleccionada = null;
    this.cargarConsultas();
  }

  // ELIMINAR
  abrirModalEliminar(consultaId: string): void { // ⭐ String
    this.consultaIdAEliminar = consultaId;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.consultaIdAEliminar = null;
  }

  eliminarConsulta(consultaId: string): void { // ⭐ String
    this.consultasService.eliminarConsulta(consultaId).subscribe({
      next: () => {
        console.log("Consulta eliminada ID:", consultaId);
        this.cerrarModalEliminar();
        this.cargarConsultas();
      },
      error: (err) => console.error("Error al eliminar", err)
    });
  }

  // RELACIONAR
  abrirModalRelacionar(consultaId: string): void { // ⭐ String
    this.consultaIdARelacionar = consultaId;
    this.mostrarModalRelacionar = true;
  }

  cerrarModalRelacionar(): void {
    this.mostrarModalRelacionar = false;
    this.consultaIdARelacionar = null;
    this.cargarConsultas();
  }

  // ACCIONES EXTRA
  exportarPDF(consultaId: string): void {
    console.log("Exportando PDF para ID:", consultaId);
  }

  editarPasos(consultaId: string): void {
    console.log("Editando pasos para ID:", consultaId);
  }
}