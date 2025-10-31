// src/app/components/vision/vision.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { EmpresasService, InfoInstitucional } from '../../../../../service/admin/empresa/empresas.service';

@Component({
  selector: 'app-vision',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './vision.component.html',
  styleUrls: ['./vision.component.css']
})
export class VisionComponent implements OnInit {
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

  // Configuración optimizada para móvil (más compacta pero completa)
  mobileQuillModules = {
    toolbar: [
      // Grupo 1: Formato básico
      ['bold', 'italic', 'underline', 'strike'],
      
      // Grupo 2: Headers y estructura
      [{ 'header': [1, 2, 3, false] }],
      ['blockquote', 'code-block'],
      
      // Grupo 3: Listas y scripts
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      
      // Grupo 4: Alineación y colores
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      
      // Grupo 5: Tamaño y fuente
      [{ 'size': ['small', false, 'large'] }],
      [{ 'font': [] }],
      
      // Grupo 6: Enlaces y media
      ['link', 'image'],
      
      // Limpiar
      ['clean']
    ]
  };

  // Configuración de fuentes personalizadas
  quillConfig = {
    'formats': [
      'bold', 'italic', 'underline', 'strike',
      'blockquote', 'code-block',
      'header', 'list', 'script',
      'indent', 'direction',
      'size', 'color', 'background',
      'font', 'align',
      'link', 'image', 'video'
    ]
  };

  constructor(private empresasSvc: EmpresasService) {}

  ngOnInit(): void {
    this.cargarVision();
  }

  private cargarVision(): void {
    this.empresasSvc.getInfoInstitucional().subscribe({
      next: info => {
        this.info = info;
        this.htmlContent = info.vision || '';
        this.originalContent = this.htmlContent;
      },
      error: err => {
        console.error('Error al cargar visión:', err);
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
    
    this.empresasSvc.actualizarInfoInstitucional({ vision: this.htmlContent })
      .subscribe({
        next: () => {
          this.showEditor = false;
          this.isSaving = false;
          this.originalContent = this.htmlContent;
          console.log('Visión actualizada:', this.htmlContent);
          this.mostrarMensajeExito();
        },
        error: err => {
          console.error('Error al guardar visión:', err);
          this.isSaving = false;
          alert('No se pudo actualizar la visión. Intenta de nuevo.');
        }
      });
  }

  private mostrarMensajeExito(): void {
    console.log('Visión guardada exitosamente');
  }
}