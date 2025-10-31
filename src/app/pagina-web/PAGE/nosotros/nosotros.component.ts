import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NosotrosService } from '../../../service/pages/nosotros/nosotros.service';

export interface Nosotros {
  descripcion: string;
  mision: string;
  vision: string;
  telefono: string | number;
  direccion: string;
}

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  providers: [NosotrosService],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.css'
})
export class NosotrosComponent implements OnInit {
  nosotros: any = null;
  error: string = '';

  constructor( private nosotrosService: NosotrosService) {}

  ngOnInit(): void {
    this.nosotrosService.getNosotros().subscribe({
      next: (data: Nosotros) => {
        this.nosotros = data;
      },
      error: (err: any) => {
        console.error(err);
        this.error = 'Error al cargar los datos de Nosotros.';
      }
    });
  }
}
