import { Component, EventEmitter, Output, Input, type OnInit, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { QuillModule } from "ngx-quill"

interface ImagePreview {
  file?: File
  url: string
  isExisting?: boolean // Para distinguir entre imágenes existentes y nuevas
}

interface Producto {
  id?: number
  producto: string
  descripcion: string
  version: string
  caracteristicas: string
  imagenCaja?: string
  imagenPortada?: string
  fotosAdicionales?: string[]
}

@Component({
  selector: "app-editar-productos-modal",
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./editar-productos-modal.component.html",
  styleUrls: ["./editar-productos-modal.component.css"],
})
export class EditarProductosModalComponent implements OnInit {
  @Input() producto: Producto | null = null
  @Output() cerrarModal = new EventEmitter<void>()
  @Output() actualizarProducto = new EventEmitter<any>()

  imagenCaja: ImagePreview | null = null
  imagenPortada: ImagePreview | null = null
  fotosAdicionales: ImagePreview[] = []

  // Para el modal de imagen completa
  imagenCompleta: string | null = null
  mostrarImagenCompleta = false

  formData = {
    producto: "",
    descripcion: "",
    version: "",
    caracteristicas: "",
  }

  ngOnInit() {
    if (this.producto) {
      this.cargarDatosProducto()
    }
  }

  cargarDatosProducto() {
    if (!this.producto) return

    // Cargar datos del formulario
    this.formData = {
      producto: this.producto.producto || "",
      descripcion: this.producto.descripcion || "",
      version: this.producto.version || "",
      caracteristicas: this.producto.caracteristicas || "",
    }

    // Cargar imagen de la caja si existe
    if (this.producto.imagenCaja) {
      this.imagenCaja = {
        url: this.producto.imagenCaja,
        isExisting: true,
      }
    }

    // Cargar imagen de la portada si existe
    if (this.producto.imagenPortada) {
      this.imagenPortada = {
        url: this.producto.imagenPortada,
        isExisting: true,
      }
    }

    // Cargar fotos adicionales si existen
    if (this.producto.fotosAdicionales && this.producto.fotosAdicionales.length > 0) {
      this.fotosAdicionales = this.producto.fotosAdicionales.map((url) => ({
        url: url,
        isExisting: true,
      }))
    }
  }

  triggerFileInput(tipo: "caja" | "portada" | "fotos") {
    let fileInput: HTMLInputElement | null = null

    if (tipo === "caja") {
      fileInput = document.querySelector("#fileInputCajaEdit") as HTMLInputElement
    } else if (tipo === "portada") {
      fileInput = document.querySelector("#fileInputPortadaEdit") as HTMLInputElement
    } else {
      fileInput = document.querySelector("#fileInputFotosEdit") as HTMLInputElement
    }

    fileInput?.click()
  }

  onFileSelected(event: Event, tipo: "caja" | "portada" | "fotos") {
    const input = event.target as HTMLInputElement
    const files = input.files

    if (!files || files.length === 0) return

    if (tipo === "caja" || tipo === "portada") {
      const file = files[0]
      const reader = new FileReader()

      reader.onload = (e) => {
        const imagePreview: ImagePreview = {
          file: file,
          url: e.target?.result as string,
          isExisting: false,
        }

        if (tipo === "caja") {
          this.imagenCaja = imagePreview
        } else {
          this.imagenPortada = imagePreview
        }
      }

      reader.readAsDataURL(file)
    } else if (tipo === "fotos") {
      const remainingSlots = 10 - this.fotosAdicionales.length
      const filesToProcess = Array.from(files).slice(0, remainingSlots)

      filesToProcess.forEach((file) => {
        const reader = new FileReader()

        reader.onload = (e) => {
          const imagePreview: ImagePreview = {
            file: file,
            url: e.target?.result as string,
            isExisting: false,
          }

          this.fotosAdicionales.push(imagePreview)
        }

        reader.readAsDataURL(file)
      })
    }

    // Reset input value
    input.value = ""
  }

  removeImage(tipo: "caja" | "portada") {
    if (tipo === "caja") {
      this.imagenCaja = null
    } else {
      this.imagenPortada = null
    }
  }

  removeFotoAdicional(index: number) {
    this.fotosAdicionales.splice(index, 1)
  }

  // Función para mostrar imagen completa
  verImagenCompleta(imagenUrl: string) {
    this.imagenCompleta = imagenUrl
    this.mostrarImagenCompleta = true
  }

  cerrarImagenCompleta() {
    this.mostrarImagenCompleta = false
    this.imagenCompleta = null
  }

  onActualizar() {
    const productoActualizado = {
      id: this.producto?.id,
      ...this.formData,
      imagenCaja: this.imagenCaja,
      imagenPortada: this.imagenPortada,
      fotosAdicionales: this.fotosAdicionales,
    }

    this.actualizarProducto.emit(productoActualizado)
  }

  onCancelar() {
    this.cerrarModal.emit()
  }

  getFotosCount(): string {
    return `${this.fotosAdicionales.length}/10`
  }
}
