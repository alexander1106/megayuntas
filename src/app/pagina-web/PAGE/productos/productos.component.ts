import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ProductoService } from '../../../service/pages/productos/productos.service'; // ajusta el path según tu estructura

interface Producto {
subtitulo: any;
  id: string | number;
  imagen: string;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent implements OnInit {
  intervalId: any;
getProductoUrl(arg0: string): string|any[]|null|undefined {
throw new Error('Method not implemented.');
}
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;

  productos: Producto[] = [];
  productosPorBloque: Producto[][] = [];
  currentSlide: number = 0;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.getProducto();
  }

    getProducto(){
    this.productoService.getProducto().subscribe({
      next: (result) => {
      console.log('Respuesta completa de productos:', result);  // <--- LOG
      if (result && Array.isArray(result)) {
        this.productos = result;
        if (this.productos.length > 0) {
          this.generarBloques();
          this.updateCarousel();
          this.startAutoSlide();
        }
      } else {
        console.error('No se recibieron productos o respuesta inválida:', result);
        this.productos = []; // para evitar errores posteriores
      }
    },
      error: (error) => {
        console.error('Error al obtener productos desde la API:', error);
      }
    });
  }

  generarBloques(): void {
    const tamanoBloque = 4;
    this.productosPorBloque = [];
    for (let i = 0; i < this.productos.length; i += tamanoBloque) {
      this.productosPorBloque.push(this.productos.slice(i, i + tamanoBloque));
    }
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  updateCarousel(): void {
    const offset = -this.currentSlide * 100;
    if (this.carousel) {
      this.carousel.nativeElement.style.transform = `translateX(${offset}%)`;
    }
  }

  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.productosPorBloque.length) % this.productosPorBloque.length;
    this.updateCarousel();
  }

  nextSlide(): void {
    this.currentSlide =
      (this.currentSlide + 1) % this.productosPorBloque.length;
    this.updateCarousel();
  }
}
