import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VistaproductoService } from '../../../../service/pages/vistaproducto/vistaproducto.service';

export interface Documento {
  document: string;
  descripcion: string;
}

export interface Multimedia {
  imagen: string;
  descripcion: string;
}

export interface DetalleProducto {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  caracteristicas: string;
  video: string;
  documentacion: Documento[];
  multimedia: Multimedia[];
}

@Component({
  selector: 'app-vistaproducto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vistaproducto.component.html',
  styleUrls: ['./vistaproducto.component.css'],
  providers: [VistaproductoService]
})
export class VistaproductoComponent implements OnInit {
  producto: DetalleProducto | null = null;
  error: string | null = null;

  mostrarTodo: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private vistaproductoService: VistaproductoService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.vistaproductoService.getProducto(id).subscribe({
        next: (data: DetalleProducto) => {
          this.producto = data;
        },
        error: (err: { message: string | null }) => {
          this.error = err.message;
        }
      });
    } else {
      this.error = 'No se proporcionó un ID válido en la ruta.';
    }
  }

  get multimediaVisible() {
  return this.mostrarTodo ? this.producto?.multimedia : this.producto?.multimedia?.slice(0, 6);
}
}
