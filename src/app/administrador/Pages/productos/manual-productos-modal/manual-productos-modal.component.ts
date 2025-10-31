import { Component, EventEmitter, Output, Input, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"

interface Documento {
  id: string
  nombre: string
  url: string
  fechaSubida: Date
  tamaño: number
}

@Component({
  selector: "app-manual-productos-modal",
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./manual-productos-modal.component.html",
  styleUrls: ["./manual-productos-modal.component.css"],
})
export class ManualProductosModalComponent {
  @Input() nombreProducto: string = ""
  @Input() productoId: number | null = null
  @Output() cerrarModal = new EventEmitter<void>()
  @Output() guardarDocumento = new EventEmitter<any>()

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>

  archivoSeleccionado: File | null = null
  isDragOver = false
  cargando = false
  progresoCarga = 0
  mensajeError = ""
  mensajeExito = ""

  // Documentos existentes (simulados - en producción vendrían del backend)
  documentosExistentes: Documento[] = [
    {
      id: "1",
      nombre: "Manual_Usuario_v1.0.pdf",
      url: "/docs/manual1.pdf",
      fechaSubida: new Date("2024-01-15"),
      tamaño: 2048000,
    },
    {
      id: "2",
      nombre: "Guia_Instalacion.pdf",
      url: "/docs/guia1.pdf",
      fechaSubida: new Date("2024-01-10"),
      tamaño: 1536000,
    },
  ]

  // Configuración
  readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  readonly ALLOWED_TYPES = ["application/pdf"]

  triggerFileInput() {
    if (!this.cargando) {
      this.fileInput.nativeElement.click()
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (file) {
      this.procesarArchivo(file)
    }

    // Reset input
    input.value = ""
  }

  onDragOver(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = true
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false
  }

  onDrop(event: DragEvent) {
    event.preventDefault()
    event.stopPropagation()
    this.isDragOver = false

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.procesarArchivo(files[0])
    }
  }

  procesarArchivo(file: File) {
    this.limpiarMensajes()

    // Validar tipo de archivo
    if (!this.ALLOWED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      this.mensajeError = "Solo se permiten archivos PDF"
      return
    }

    // Validar tamaño
    if (file.size > this.MAX_FILE_SIZE) {
      this.mensajeError = `El archivo es demasiado grande. Máximo permitido: ${this.formatFileSize(this.MAX_FILE_SIZE)}`
      return
    }

    this.archivoSeleccionado = file
    this.simularCargaArchivo()
  }

  simularCargaArchivo() {
    this.cargando = true
    this.progresoCarga = 0

    const interval = setInterval(() => {
      this.progresoCarga += Math.random() * 15 + 5

      if (this.progresoCarga >= 100) {
        this.progresoCarga = 100
        clearInterval(interval)

        setTimeout(() => {
          this.cargando = false
          this.mensajeExito = "Archivo procesado correctamente"
        }, 500)
      }
    }, 200)
  }

  removeFile(event: Event) {
    event.stopPropagation()
    this.archivoSeleccionado = null
    this.limpiarMensajes()
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  limpiarMensajes() {
    this.mensajeError = ""
    this.mensajeExito = ""
  }

  descargarDocumento(documento: Documento) {
    // Simular descarga
    const link = document.createElement("a")
    link.href = documento.url
    link.download = documento.nombre
    link.click()

    console.log("Descargando documento:", documento.nombre)
  }

  eliminarDocumento(documento: Documento) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${documento.nombre}"?`)) {
      this.documentosExistentes = this.documentosExistentes.filter((doc) => doc.id !== documento.id)
      console.log("Documento eliminado:", documento.nombre)
    }
  }

  onGuardar() {
    if (!this.archivoSeleccionado) {
      this.mensajeError = "Por favor selecciona un archivo PDF"
      return
    }

    const documentoData = {
      productoId: this.productoId,
      nombreProducto: this.nombreProducto,
      archivo: this.archivoSeleccionado,
      fechaSubida: new Date(),
    }

    this.guardarDocumento.emit(documentoData)
  }

  onCancelar() {
    if (this.cargando) {
      if (confirm("Hay una carga en progreso. ¿Estás seguro de que quieres cancelar?")) {
        this.cerrarModal.emit()
      }
    } else {
      this.cerrarModal.emit()
    }
  }
}
