import { CommonModule } from "@angular/common"
import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { AgregarConsultasComponent } from "./agregar-consultas/agregar-consultas.component"
import { EditarConsultasComponent } from "./editar-consultas/editar-consultas.component"
import { EliminarConsultasComponent } from "./eliminar-consultas/eliminar-consultas.component"
import { RelacionarConsultasComponent } from "./relacionar-consultas/relacionar-consultas.component"

interface Consultas {
  id: number
  consulta: string
  productos: string
  modulos: string
  descripcion?: string
  video?: string
  mostrar?: boolean
  consultasRelacionadas?: number[] // IDs de consultas relacionadas
}

@Component({
  selector: "app-consultas",
  standalone: true,
  imports: [
    CommonModule,
    AgregarConsultasComponent,
    EditarConsultasComponent,
    EliminarConsultasComponent,
    RelacionarConsultasComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./consultas.component.html",
  styleUrl: "./consultas.component.css",
})
export class ConsultasComponent {
  mostrarModalAgregar = false
  mostrarModalEditar = false
  mostrarModalEliminar = false
  mostrarModalRelacionar = false
  consultaIdAEliminar: number | null = null
  consultaIdAEditar: number | null = null
  consultaIdARelacionar: number | null = null

  // Variables para paginación móvil
  paginaActual = 1
  itemsPorPagina = 10

  // Hacer Math disponible en el template
  Math = Math

  consulta: Consultas[] = [
    {
      id: 1,
      consulta: "Configuración inicial del sistema",
      productos: "Sistema Base",
      modulos: "Configuración",
      descripcion: "Pasos para configurar el sistema por primera vez",
      video: "https://example.com/video1",
      mostrar: true,
      consultasRelacionadas: [2, 3],
    },
    {
      id: 2,
      consulta: "Gestión de usuarios",
      productos: "Módulo Usuarios",
      modulos: "Administración",
      descripcion: "Cómo crear y gestionar usuarios del sistema",
      video: "https://example.com/video2",
      mostrar: true,
      consultasRelacionadas: [1, 6],
    },
    {
      id: 3,
      consulta: "Reportes mensuales",
      productos: "Módulo Reportes",
      modulos: "Reportes",
      descripcion: "Generación de reportes mensuales",
      video: "https://example.com/video3",
      mostrar: false,
      consultasRelacionadas: [],
    },
    {
      id: 4,
      consulta: "Backup de datos",
      productos: "Sistema Base",
      modulos: "Mantenimiento",
      descripcion: "Procedimiento para realizar backup de datos",
      video: "https://example.com/video4",
      mostrar: true,
      consultasRelacionadas: [7],
    },
    {
      id: 5,
      consulta: "Integración con APIs",
      productos: "Módulo Integración",
      modulos: "Desarrollo",
      descripcion: "Cómo integrar APIs externas",
      video: "https://example.com/video5",
      mostrar: true,
      consultasRelacionadas: [],
    },
    {
      id: 6,
      consulta: "Configuración de permisos",
      productos: "Módulo Seguridad",
      modulos: "Seguridad",
      descripcion: "Configurar permisos de usuario",
      video: "https://example.com/video6",
      mostrar: true,
      consultasRelacionadas: [2],
    },
    {
      id: 7,
      consulta: "Mantenimiento preventivo",
      productos: "Sistema Base",
      modulos: "Mantenimiento",
      descripcion: "Rutinas de mantenimiento preventivo",
      video: "https://example.com/video7",
      mostrar: false,
      consultasRelacionadas: [4],
    },
    {
      id: 8,
      consulta: "Migración de datos",
      productos: "Herramientas",
      modulos: "Migración",
      descripcion: "Proceso de migración de datos",
      video: "https://example.com/video8",
      mostrar: true,
      consultasRelacionadas: [],
    },
    {
      id: 9,
      consulta: "Optimización de rendimiento",
      productos: "Sistema Base",
      modulos: "Optimización",
      descripcion: "Técnicas para optimizar el rendimiento",
      video: "https://example.com/video9",
      mostrar: true,
      consultasRelacionadas: [],
    },
    {
      id: 10,
      consulta: "Resolución de errores comunes",
      productos: "Soporte",
      modulos: "Troubleshooting",
      descripcion: "Soluciones a errores frecuentes",
      video: "https://example.com/video10",
      mostrar: true,
      consultasRelacionadas: [],
    },
  ]

  // Getters para paginación
  get totalPaginas(): number {
    return Math.ceil(this.consulta.length / this.itemsPorPagina)
  }

  get consultasPaginadas(): Consultas[] {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina
    const fin = inicio + this.itemsPorPagina
    return this.consulta.slice(inicio, fin)
  }

  get numerosPaginas(): number[] {
    const total = this.totalPaginas
    const actual = this.paginaActual
    const numeros: number[] = []

    // Mostrar máximo 5 números de página
    let inicio = Math.max(1, actual - 2)
    const fin = Math.min(total, inicio + 4)

    // Ajustar si estamos cerca del final
    if (fin - inicio < 4) {
      inicio = Math.max(1, fin - 4)
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i)
    }

    return numeros
  }

  // Métodos de navegación de paginación
  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++
    }
  }

  // FUNCIONES PARA MODAL AGREGAR
  abrirModalAgregar(): void {
    this.mostrarModalAgregar = true
  }

  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false
  }

  onConsultaGuardada(nuevaConsulta: any): void {
    // Generar nuevo ID
    const nuevoId = Math.max(...this.consulta.map((c) => c.id)) + 1

    // Agregar la nueva consulta al array
    const consultaCompleta: Consultas = {
      id: nuevoId,
      consulta: nuevaConsulta.consulta,
      productos: nuevaConsulta.producto,
      modulos: nuevaConsulta.modulo,
      descripcion: nuevaConsulta.descripcion,
      video: nuevaConsulta.video,
      mostrar: nuevaConsulta.mostrar,
      consultasRelacionadas: [],
    }

    this.consulta.push(consultaCompleta)

    // Ir a la última página para mostrar la nueva consulta
    this.paginaActual = this.totalPaginas

    this.cerrarModalAgregar()

    console.log("Nueva consulta agregada:", consultaCompleta)
  }

  // FUNCIONES PARA MODAL EDITAR
  abrirModalEditar(consultaId: number): void {
    this.consultaIdAEditar = consultaId
    this.mostrarModalEditar = true
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false
    this.consultaIdAEditar = null
  }

  onConsultaEditada(consultaEditada: any): void {
    const index = this.consulta.findIndex((c) => c.id === this.consultaIdAEditar)
    if (index !== -1) {
      this.consulta[index] = {
        ...this.consulta[index],
        consulta: consultaEditada.consulta,
        productos: consultaEditada.producto,
        modulos: consultaEditada.modulo,
        descripcion: consultaEditada.descripcion,
        video: consultaEditada.video,
        mostrar: consultaEditada.mostrar,
      }
    }
    this.cerrarModalEditar()

    console.log("Consulta editada:", consultaEditada)
  }

  // FUNCIONES PARA MODAL ELIMINAR
  abrirModalEliminar(consultaId: number): void {
    this.consultaIdAEliminar = consultaId
    this.mostrarModalEliminar = true
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false
    this.consultaIdAEliminar = null
  }

  eliminarConsulta(consultaId: number): void {
    console.log("Eliminando consulta con ID:", consultaId)
    this.consulta = this.consulta.filter((consultas) => consultas.id !== consultaId)

    // Ajustar página si es necesario
    if (this.paginaActual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaActual = this.totalPaginas
    }

    this.cerrarModalEliminar()
  }

  // FUNCIONES PARA MODAL RELACIONAR
  abrirModalRelacionar(consultaId: number): void {
    this.consultaIdARelacionar = consultaId
    this.mostrarModalRelacionar = true
  }

  cerrarModalRelacionar(): void {
    this.mostrarModalRelacionar = false
    this.consultaIdARelacionar = null
  }

  onConsultasRelacionadas(consultasRelacionadas: any[]): void {
    const index = this.consulta.findIndex((c) => c.id === this.consultaIdARelacionar)
    if (index !== -1) {
      // Extraer solo los IDs de las consultas relacionadas
      const idsRelacionados = consultasRelacionadas.map((consulta) => consulta.id)

      // Actualizar la consulta con las nuevas relaciones
      this.consulta[index] = {
        ...this.consulta[index],
        consultasRelacionadas: idsRelacionados,
      }
    }

    this.cerrarModalRelacionar()
    console.log("Consultas relacionadas actualizadas:", consultasRelacionadas)
  }

  // FUNCIONES ADICIONALES PARA LOS BOTONES DE ACCIÓN
  exportarPDF(consultaId: number): void {
    console.log("Exportando PDF para consulta ID:", consultaId)
    // Aquí implementarías la lógica para exportar a PDF
  }

  editarPasos(consultaId: number): void {
    console.log("Editando pasos para consulta ID:", consultaId)
    // Aquí implementarías la lógica para editar pasos
  }

  relacionarConsultas(consultaId: number): void {
    console.log("Abriendo modal para relacionar consultas con ID:", consultaId)
    this.abrirModalRelacionar(consultaId)
  }
}
