import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Consulta {
  id: string | number;
  titulo: string;
  descripcion: string;
  producto: string;
}

export interface BusquedaReciente {
  titulo: string;
}

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css']
})
export class ConsultasComponent implements OnInit {
  searchQuery: string = '';
  consultas: Consulta[] = [];
  consultasFiltradas: Consulta[] = [];
  consultasPorPagina = 6;
  paginaActual = 0;

  busquedasRecientes: BusquedaReciente[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Cargar consultas
    this.http.get<Consulta[]>('api/consultas').subscribe({
      next: (data) => {
        this.consultas = data;
        this.consultasFiltradas = data;
      },
      error: (err) => {
        console.error('Error al cargar consultas desde la API:', err);
      }
    });

    // Cargar búsquedas recientes
    this.http.get<BusquedaReciente[]>('api/busquedas/recientes').subscribe({
      next: (data) => {
        this.busquedasRecientes = data;
      },
      error: (err) => {
        console.error('Error al cargar búsquedas recientes desde la API:', err);
      }
    });
  }

  buscar(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.paginaActual = 0;

    if (query === '') {
      this.consultasFiltradas = this.consultas;
    } else {
      this.consultasFiltradas = this.consultas.filter(consulta =>
        consulta.titulo.toLowerCase().includes(query) ||
        consulta.producto.toLowerCase().includes(query)
      );
    }
  }

  obtenerConsultasPaginadas(): Consulta[] {
    const inicio = this.paginaActual * this.consultasPorPagina;
    return this.consultasFiltradas.slice(inicio, inicio + this.consultasPorPagina);
  }

  siguientePagina(): void {
    if ((this.paginaActual + 1) * this.consultasPorPagina < this.consultasFiltradas.length) {
      this.paginaActual++;
    }
  }

  anteriorPagina(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
    }
  }

  irAVistaConsulta(titulo: string): void {
    const consultaEncontrada = this.consultas.find(
      (c) => c.titulo.trim().toLowerCase() === titulo.trim().toLowerCase()
    );

    if (consultaEncontrada) {
      this.router.navigate(['/vistaconsulta', consultaEncontrada.id]);
    } else {
      alert('No se encontró una consulta que coincida con esta búsqueda.');
    }
  }

  resaltarCoincidencia(texto: string): string {
    if (!this.searchQuery.trim()) return texto;

    const query = this.searchQuery.trim();
    const regex = new RegExp(`(${query})`, 'gi');
    return texto.replace(regex, `<mark class="bg-yellow-200">$1</mark>`);
  }
}
