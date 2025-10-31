import { Component, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

interface ImagePreview {
  file: File;
  url: string;
}

@Component({
  selector: 'app-agregar-productos-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './agregar-productos-modal.component.html',
  styleUrls: ['./agregar-productos-modal.component.css']
})
export class AgregarProductosModalComponent {
  @Output() cerrarModal = new EventEmitter<void>();
  @Output() guardarProducto = new EventEmitter<any>();

  imagenCaja: ImagePreview | null = null;
  imagenPortada: ImagePreview | null = null;
  fotosAdicionales: ImagePreview[] = [];

  // Para el modal de imagen completa
  imagenCompleta: string | null = null;
  mostrarImagenCompleta = false;

  formData = {
    producto: '',
    descripcion: '',
    version: '',
    caracteristicas: ''
  };

  triggerFileInput(tipo: 'caja' | 'portada' | 'fotos') {
    let fileInput: HTMLInputElement | null = null;
    
    if (tipo === 'caja') {
      fileInput = document.querySelector('#fileInputCaja') as HTMLInputElement;
    } else if (tipo === 'portada') {
      fileInput = document.querySelector('#fileInputPortada') as HTMLInputElement;
    } else {
      fileInput = document.querySelector('#fileInputFotos') as HTMLInputElement;
    }
    
    fileInput?.click();
  }

  onFileSelected(event: Event, tipo: 'caja' | 'portada' | 'fotos') {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    if (tipo === 'caja' || tipo === 'portada') {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const imagePreview: ImagePreview = {
          file: file,
          url: e.target?.result as string
        };

        if (tipo === 'caja') {
          this.imagenCaja = imagePreview;
        } else {
          this.imagenPortada = imagePreview;
        }
      };
      
      reader.readAsDataURL(file);
    } else if (tipo === 'fotos') {
      const remainingSlots = 10 - this.fotosAdicionales.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const imagePreview: ImagePreview = {
            file: file,
            url: e.target?.result as string
          };
          
          this.fotosAdicionales.push(imagePreview);
        };
        
        reader.readAsDataURL(file);
      });
    }

    // Reset input value
    input.value = '';
  }

  removeImage(tipo: 'caja' | 'portada') {
    if (tipo === 'caja') {
      this.imagenCaja = null;
    } else {
      this.imagenPortada = null;
    }
  }

  removeFotoAdicional(index: number) {
    this.fotosAdicionales.splice(index, 1);
  }

  // Función para mostrar imagen completa
  verImagenCompleta(imagenUrl: string) {
    this.imagenCompleta = imagenUrl;
    this.mostrarImagenCompleta = true;
  }

  cerrarImagenCompleta() {
    this.mostrarImagenCompleta = false;
    this.imagenCompleta = null;
  }

  onGuardar() {
    const productoData = {
      ...this.formData,
      imagenCaja: this.imagenCaja,
      imagenPortada: this.imagenPortada,
      fotosAdicionales: this.fotosAdicionales
    };

    this.guardarProducto.emit(productoData);
  }

  onCancelar() {
    this.cerrarModal.emit();
  }

  getFotosCount(): string {
    return `${this.fotosAdicionales.length}/10`;
  }
}