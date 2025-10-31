// src/app/components/mision/mision.component.ts
import { Component, CUSTOM_ELEMENTS_SCHEMA, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { QuillModule } from "ngx-quill"
import { EmpresasService, type InfoInstitucional } from "../../../../../service/admin/empresa/empresas.service"

@Component({
  selector: "app-mision",
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./mision.component.html",
  styleUrls: ["./mision.component.css"],
})
export class MisionComponent implements OnInit {
  showEditor = false
  htmlContent = ""
  isSaving = false
  private info!: InfoInstitucional

  constructor(private empresasSvc: EmpresasService) {}

  ngOnInit(): void {
    console.log("MisionComponent inicializado") // Debug
    this.cargarMision()
  }

  private cargarMision(): void {
    this.empresasSvc.getInfoInstitucional().subscribe({
      next: (info) => {
        console.log("Misión cargada:", info) // Debug
        this.info = info
        this.htmlContent = info.mision || "Define aquí la misión de tu empresa: su propósito, objetivos y compromiso."
      },
      error: (err) => {
        console.error("Error al cargar misión:", err)
        this.htmlContent = "Define aquí la misión de tu empresa: su propósito, objetivos y compromiso."
      },
    })
  }

  onEditar(): void {
    this.showEditor = true
  }

  guardarContenido(): void {
    if (this.isSaving) return

    this.isSaving = true
    console.log("Guardando misión:", this.htmlContent) // Debug

    // Al guardar, enviamos solo el campo "mision"
    this.empresasSvc.actualizarInfoInstitucional({ mision: this.htmlContent }).subscribe({
      next: () => {
        console.log("Misión actualizada exitosamente")
        this.showEditor = false
        this.isSaving = false
      },
      error: (err) => {
        console.error("Error al guardar misión:", err)
        this.isSaving = false
        alert("No se pudo actualizar la misión. Intenta de nuevo.")
      },
    })
  }
}
