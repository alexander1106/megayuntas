import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AgregarProductosModalComponent } from "./agregar-productos-modal/agregar-productos-modal.component"
import { EditarProductosModalComponent } from "./editar-productos-modal/editar-productos-modal.component"
import { ManualProductosModalComponent } from "./manual-productos-modal/manual-productos-modal.component"
// Mantén tus otros imports de modales si los necesitas
import { EditarConsultasComponent } from "../consultas/editar-consultas/editar-consultas.component"
import { EliminarConsultasComponent } from "../consultas/eliminar-consultas/eliminar-consultas.component"

interface Consultas {
  id: number
  productos: string
  descripcion: string
  version: string
  caracteristicas?: string
  imagenCaja?: any
  imagenPortada?: any
  fotosAdicionales?: any[]
}

@Component({
  selector: "app-productos",
  standalone: true,
  imports: [
    CommonModule,
    AgregarProductosModalComponent,
    EditarProductosModalComponent,
    ManualProductosModalComponent,
    EditarConsultasComponent,
    EliminarConsultasComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: "./productos.component.html",
  styleUrl: "./productos.component.css",
})
export class ProductosComponent {
  mostrarModalAgregar = false
  mostrarModalEditar = false
  mostrarModalEliminar = false
  mostrarModalManual = false // Nuevo modal para manuales
  consultaIdAEliminar: number | null = null
  productoSeleccionado: Consultas | null = null

  consulta: Consultas[] = [
    {
      id: 1,
      productos: "YUPAY",
      descripcion:
        "La palabra YUPAY, proviene del verbo CONTAR en Quechua, este sistema nace de la necesidad de tener un producto informático de gestión contable, y que brinde el soporte y la garantía necesaria para su funcionamiento en la Region San Martin. El Software de Contabilidad YUPAY fue diseñado para satisfacer las necesidades de información contable, requeridas por SUNAT, permitiendo un ingreso rápido y eficiente de los datos, y que al mismo tiempo genere información CONFIABLE y OPORTUNA. Es un programa intuitivo que es fácil de configurar y utilizar. No se necesita entrenamiento especializado y permite trabajar rápido con una interfaz cómoda para el usuario que se ve y se siente como los programas que se utilizan diariamente. Se adapta fácilmente al manejo de su contabilidad y agiliza la generación de información contable.",
      version: "2.2.32",
    },
    {
      id: 2,
      productos: "JHON",
      descripcion: "DOE",
      version: "2.2.32",
    },
  ]

  // FUNCIÓN DE AGREGAR PRODUCTO
  abrirModalAgregar(): void {
    this.mostrarModalAgregar = true
  }

  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false
  }

  // Nueva función para manejar el guardado del producto
  onGuardarProducto(productoData: any): void {
    console.log("Datos del producto recibidos:", productoData)

    // Crear nuevo producto con ID único
    const nuevoProducto: Consultas = {
      id: this.consulta.length > 0 ? Math.max(...this.consulta.map((p) => p.id)) + 1 : 1,
      productos: productoData.producto,
      descripcion: productoData.descripcion,
      version: productoData.version,
      caracteristicas: productoData.caracteristicas,
      imagenCaja: productoData.imagenCaja,
      imagenPortada: productoData.imagenPortada,
      fotosAdicionales: productoData.fotosAdicionales,
    }

    // Agregar el nuevo producto al array
    this.consulta.push(nuevoProducto)

    // Cerrar el modal
    this.cerrarModalAgregar()

    // Opcional: mostrar mensaje de éxito
    console.log("Producto agregado exitosamente:", nuevoProducto)
  }

  // FUNCIÓN DE EDITAR PRODUCTO
  abrirModalEditar(consulta: Consultas): void {
    this.productoSeleccionado = { ...consulta }
    this.mostrarModalEditar = true
  }

  cerrarModalEditar(): void {
    this.mostrarModalEditar = false
    this.productoSeleccionado = null
  }

  // Actualizar producto
  actualizarProducto(productoData: any): void {
    console.log("Datos del producto a actualizar:", productoData)

    const index = this.consulta.findIndex((p) => p.id === productoData.id)

    if (index !== -1) {
      const productoActualizado: Consultas = {
        id: productoData.id,
        productos: productoData.producto,
        descripcion: productoData.descripcion,
        version: productoData.version,
        caracteristicas: productoData.caracteristicas,
        imagenCaja: productoData.imagenCaja,
        imagenPortada: productoData.imagenPortada,
        fotosAdicionales: productoData.fotosAdicionales,
      }

      this.consulta[index] = productoActualizado
      this.cerrarModalEditar()

      console.log("Producto actualizado exitosamente:", productoActualizado)
    }
  }

  // FUNCIÓN DE MANUAL PRODUCTO
  abrirModalManual(consulta: Consultas): void {
    this.productoSeleccionado = { ...consulta }
    this.mostrarModalManual = true
  }

  cerrarModalManual(): void {
    this.mostrarModalManual = false
    this.productoSeleccionado = null
  }

  // Guardar documento/manual
  guardarDocumento(documentoData: any): void {
    console.log("Documento guardado para el producto:", documentoData)

    // Aquí implementarías la lógica para guardar el documento
    // Por ejemplo, subirlo a un servidor o almacenarlo localmente

    this.cerrarModalManual()

    // Mostrar mensaje de éxito (opcional)
    alert(`Manual guardado para ${documentoData.nombreProducto}`)
  }

  // FUNCIÓN DE ELIMINAR PRODUCTO
  abrirModalEliminar(consultaId: number): void {
    this.consultaIdAEliminar = consultaId
    this.mostrarModalEliminar = true
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false
    this.consultaIdAEliminar = null
  }

  eliminarProducto(consultaId: number): void {
    console.log("Eliminando producto con ID:", consultaId)
    this.consulta = this.consulta.filter((consultas) => consultas.id !== consultaId)
    this.cerrarModalEliminar()
  }
}
