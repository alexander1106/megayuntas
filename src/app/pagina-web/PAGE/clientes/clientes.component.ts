import { Component, OnInit } from '@angular/core';
import { ClientesService } from '../../../service/pages/clientes/clientes.service';
import { VistaclienteService } from '../../../service/pages/vistacliente/vistacliente.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

export interface Cliente {
  id: number;
  nombreCliente: string;
  imagenCliente: string;
}

export interface ClienteProducto {
  idcliente: number;
  nombreCliente: string;
  nombreProducto: string;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesPaginados: Cliente[] = [];
  paginaActual: number = 0;
  clientesPorPagina: number = 4;
  totalClientes: number = 0;

  clienteSeleccionado: Cliente | null = null;
  productosCliente: ClienteProducto[] = [];
  cargandoProductos: boolean = false;
  mostrarDetalle: boolean = false;

  constructor(
    private clientesService: ClientesService,
    private vistaClienteService: VistaclienteService
  ) {}

  ngOnInit(): void {
    this.clientesService.obtenerClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.totalClientes = data.length;
        this.actualizarClientesPaginados();
      },
      error: (err) => {
        console.error('Error al obtener clientes', err);
      }
    });
  }

  actualizarClientesPaginados(): void {
    const inicio = this.paginaActual * this.clientesPorPagina;
    const fin = inicio + this.clientesPorPagina;
    this.clientesPaginados = this.clientes.slice(inicio, fin);
  }

  siguientePagina(): void {
    const siguienteInicio = (this.paginaActual + 1) * this.clientesPorPagina;
    if (siguienteInicio < this.totalClientes) {
      this.paginaActual++;
      this.actualizarClientesPaginados();
    }
  }

  anteriorPagina(): void {
    if (this.paginaActual > 0) {
      this.paginaActual--;
      this.actualizarClientesPaginados();
    }
  }

  abrirModal(cliente: Cliente): void {
    this.clienteSeleccionado = cliente;
    this.cargandoProductos = true;
    this.mostrarDetalle = true;

    this.vistaClienteService.obtenerProductosPorCliente(cliente.id).subscribe({
      next: (data) => {
        this.productosCliente = data;
        this.cargandoProductos = false;
      },
      error: (err) => {
        console.error('Error al cargar productos del cliente', err);
        this.productosCliente = [];
        this.cargandoProductos = false;
      }
    });
  }

  cerrarDetalle(): void {
    this.mostrarDetalle = false;
    this.clienteSeleccionado = null;
    this.productosCliente = [];
  }
}
