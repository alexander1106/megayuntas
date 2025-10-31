import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VistaconsultaService } from '../../../../service/pages/vistaconsulta/vistaconsulta.service';
import { BusquedasService } from '../../../../service/pages/busquedas/busquedas.service';
import { ComentariosService } from '../../../../service/pages/comentarios/comentarios.service';
import { HttpClientModule } from '@angular/common/http';

export interface Paso {
  tituloPaso: string;
  imagenPaso: string;
  descripcionPaso: string; // HTML
}

export interface ConsultaDetalle {
  tituloConsulta: string;
  nombreProducto: string;
  descripcionConsulta: string;
  pasos: Paso[];
}

export interface BusquedaReciente {
  titulo: string;
}

export interface Comentario {
  idComentario: number;
  comentario: string;
  fecha: string;
  nombres: string;
  apellidos: string;
  imagenUsuario: string;
  nombreEmpresa: string;
}

@Component({
  selector: 'app-vistaconsulta',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './vistaconsulta.component.html',
  styleUrl: './vistaconsulta.component.css'
})
export class VistaconsultaComponent implements OnInit {
  consulta!: ConsultaDetalle;
  busquedasRecientes: BusquedaReciente[] = [];
  comentario: string = '';
  mostrarTodosLosPasos: boolean = false;
  error: string = '';

  comentarios: { nombre: string; fecha: string; texto: string }[] = [];

  private idConsulta: number = 0;
  pasosAgrupados: any[] = [];

  constructor(
    private vistaconsultaService: VistaconsultaService,
    private busquedasService: BusquedasService,
    private comentariosService: ComentariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idConsulta = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(this.idConsulta)) {
      this.vistaconsultaService.obtenerConsulta(this.idConsulta).subscribe({
        next: (data) => {
          this.consulta = data;
          this.pasosAgrupados = this.agruparPasosPorTituloYDescripcion(this.consulta.pasos);
        },
        error: () => {
          this.error = 'No se pudo cargar la consulta. Verifica tu conexión.';
        }
      });

      this.comentariosService.obtenerComentarios(this.idConsulta).subscribe({
        next: (data: Comentario[]) => {
          this.comentarios = data.map(c => ({
            nombre: `${c.nombres} ${c.apellidos}`,
            fecha: new Date(c.fecha).toLocaleString('es-PE', {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit'
            }),
            texto: c.comentario
          }));
        },
        error: (err) => {
          console.error('Error al obtener comentarios:', err);
        }
      });
    } else {
      this.error = 'ID de consulta inválido.';
    }

    this.busquedasService.obtenerBusquedasRecientes().subscribe({
      next: (data) => {
        this.busquedasRecientes = data;
      },
      error: (err) => {
        console.error('Error al obtener búsquedas recientes:', err);
      }
    });
  }

  comentar(): void {
    const texto = this.comentario.trim();
    if (texto) {
      const nuevoComentario = {
        nombre: '',
        fecha: new Date().toLocaleString(),
        texto
      };
      this.comentarios.unshift(nuevoComentario);
      this.comentario = '';
    }
  }

  verMasPasos(): void {
    this.mostrarTodosLosPasos = true;
  }

  irAVistaConsulta(titulo: string): void {
    if (
      this.consulta &&
      this.consulta.tituloConsulta.trim().toLowerCase() === titulo.trim().toLowerCase()
    ) {
      this.router.navigate(['/vistaconsulta', this.idConsulta]);
    } else {
      alert('No se encontró la consulta con ese título.');
    }
  }

  agruparPasosPorTituloYDescripcion(pasos: Paso[]): any[] {
    const mapa = new Map<string, { tituloPaso: string; descripcionPaso: string; imagenes: string[] }>();

    pasos.forEach(paso => {
      const clave = paso.tituloPaso + '|' + paso.descripcionPaso;

      if (!mapa.has(clave)) {
        mapa.set(clave, {
          tituloPaso: paso.tituloPaso,
          descripcionPaso: paso.descripcionPaso,
          imagenes: paso.imagenPaso ? [paso.imagenPaso] : []
        });
      } else {
        if (paso.imagenPaso) {
          mapa.get(clave)!.imagenes.push(paso.imagenPaso);
        }
      }
    });

    return Array.from(mapa.values());
  }
}
