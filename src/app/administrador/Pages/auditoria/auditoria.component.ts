import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditoriaService, Auditoria } from '../../../service/admin/auditoria/auditoria.service';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auditoria.component.html',
})
export class AuditoriaComponent implements OnInit {
  auditorias: Auditoria[] = [];
  cargando = false;

  // Filtros
  busquedaUsuario = '';
  busquedaAccion = '';

  constructor(private auditoriaService: AuditoriaService) {}

  ngOnInit(): void {
    this.cargarAuditorias();
  }

  cargarAuditorias(): void {
    this.cargando = true;
    this.auditoriaService.getAuditorias().subscribe({
      next: (data) => {
        this.auditorias = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error cargando auditoría:', err);
        this.cargando = false;
      }
    });
  }

  buscar(): void {
    this.cargando = true;

    if (this.busquedaUsuario.trim()) {
      // Filtrar por Usuario
      this.auditoriaService.getAuditoriasPorUsuario(this.busquedaUsuario).subscribe({
        next: (data) => { this.auditorias = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else if (this.busquedaAccion.trim()) {
      // Filtrar por Acción
      this.auditoriaService.getAuditoriasPorAccion(this.busquedaAccion).subscribe({
        next: (data) => { this.auditorias = data; this.cargando = false; },
        error: () => this.cargando = false
      });
    } else {
      // Si está vacío, cargar todo
      this.cargarAuditorias();
    }
  }

  limpiarFiltros(): void {
    this.busquedaUsuario = '';
    this.busquedaAccion = '';
    this.cargarAuditorias();
  }
}
