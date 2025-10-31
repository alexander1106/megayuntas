// src/app/components/direccion/direccion.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { EmpresasService, InfoInstitucional } from '../../../../../service/admin/empresa/empresas.service';

@Component({
  selector: 'app-direccion',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './direccion.component.html',
  styleUrls: ['./direccion.component.css']
})
export class DireccionComponent implements OnInit {
  showEditor = false;
  htmlContent = '';
  isSaving = false;
  private info!: InfoInstitucional;
  private originalContent = '';

  // Configuración completa del editor Quill para desktop
  desktopQuillModules = {
    toolbar: [
      // Fila 1: Formato de texto básico
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      
      // Fila 2: Headers y listas
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      
      // Fila 3: Indentación y dirección
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      
      // Fila 4: Tamaños y fuentes
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
      // Fila 5: Colores y alineación
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      
      // Fila 6: Enlaces y media
      ['link', 'image', 'video'],
      
      // Limpiar formato
      ['clean']
    ]
  };

  // Configuración CORREGIDA para móvil - toolbar más organizada y visible
  mobileQuillModules = {
    toolbar: {
      container: [
        // Fila 1: Formato básico
        ['bold', 'italic', 'underline', 'strike'],
        
        // Fila 2: Headers y estructura  
        [{ 'header': [1, 2, 3, false] }, 'blockquote', 'code-block'],
        
        // Fila 3: Listas y alineación - CORRECCIÓN APLICADA
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'align': [] }],
        
        // Fila 4: Colores - CONFIGURACIÓN ESPECÍFICA PARA MÓVIL
        [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }, 
         { 'background': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'] }],
        
        // Fila 5: Tamaño y fuente
        [{ 'size': ['small', false, 'large'] }, { 'font': [] }],
        
        // Fila 6: Scripts y enlaces
        [{ 'script': 'sub'}, { 'script': 'super' }, 'link', 'image'],
        
        // Fila 7: Limpiar
        ['clean']
      ]
    }
  };

  constructor(private empresasSvc: EmpresasService) {}

  ngOnInit(): void {
    this.cargarDireccion();
  }

  private cargarDireccion(): void {
    // Al iniciar, cargamos la dirección desde la API
    this.empresasSvc.getInfoInstitucional().subscribe({
      next: info => {
        this.info = info;
        this.htmlContent = info.direccion || '';
        this.originalContent = this.htmlContent;
      },
      error: err => {
        console.error('Error al cargar dirección:', err);
        this.htmlContent = '';
      }
    });
  }

  toggleEditor(): void {
    if (!this.showEditor) {
      this.originalContent = this.htmlContent;
    }
    this.showEditor = !this.showEditor;
  }

  cancelarEdicion(): void {
    this.htmlContent = this.originalContent;
    this.showEditor = false;
  }

  onEditar(): void {
    this.showEditor = true;
  }

  guardarContenido(): void {
    if (this.isSaving) return;
    
    this.isSaving = true;
    
    // Al guardar, enviamos solo el campo "direccion"
    this.empresasSvc.actualizarInfoInstitucional({ direccion: this.htmlContent })
      .subscribe({
        next: () => {
          this.showEditor = false;
          this.isSaving = false;
          this.originalContent = this.htmlContent;
          console.log('Dirección actualizada:', this.htmlContent);
          this.mostrarMensajeExito();
        },
        error: err => {
          console.error('Error al guardar dirección:', err);
          this.isSaving = false;
          alert('No se pudo actualizar la dirección. Intenta de nuevo.');
        }
      });
  }

  private mostrarMensajeExito(): void {
    console.log('Dirección guardada exitosamente');
  }
} 