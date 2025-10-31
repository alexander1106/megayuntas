// src/app/components/presentacion/presentacion.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { QuillModule } from "ngx-quill"
import { EmpresasService, type InfoInstitucional } from "../../../../../service/admin/empresa/empresas.service"

@Component({
  selector: "app-presentacion",
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./presentacion.component.html",
  styleUrls: ["./presentacion.component.css"],
})
export class PresentacionComponent implements OnInit {
  showEditor = false
  htmlContent = ""
  isSaving = false
  private info!: InfoInstitucional

  constructor(private empresasSvc: EmpresasService) {}

  ngOnInit(): void {
    console.log("PresentacionComponent inicializado") // Debug
    this.cargarPresentacion()
  }

  private cargarPresentacion(): void {
    this.empresasSvc.getInfoInstitucional().subscribe({
      next: (info) => {
        console.log("Info cargada:", info) // Debug
        this.info = info
        this.htmlContent =
          info.descripcion || "Bienvenido a nuestra empresa. Aquí puedes agregar la presentación de tu organización."
      },
      error: (err) => {
        console.error("Error al cargar presentación:", err)
        this.htmlContent = "Bienvenido a nuestra empresa. Aquí puedes agregar la presentación de tu organización."
      },
    })
  }

  onEditar(): void {
    this.showEditor = true
  }

  guardarContenido(): void {
    if (this.isSaving) return

    this.isSaving = true
    console.log("Guardando contenido:", this.htmlContent) // Debug

    // Actualizo solo la descripción
    this.empresasSvc.actualizarInfoInstitucional({ descripcion: this.htmlContent }).subscribe({
      next: () => {
        console.log("Descripción actualizada exitosamente")
        this.showEditor = false
        this.isSaving = false
      },
      error: (err) => {
        console.error("Error al guardar descripción:", err)
        this.isSaving = false
        alert("No se pudo guardar la presentación. Intenta de nuevo.")
      },
    })
  }
}
