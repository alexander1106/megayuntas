import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';

import { EliminarUsuariosModalComponent } from './eliminar-usuarios-modal/eliminar-usuarios-modal.component';
import { UsuariosService } from '../../../service/admin/usuario/usuarios.service';
import { EditarUsuariosModalComponent } from './editar-usuarios-modal/editar-usuarios-modal.component';

import jsPDF from 'jspdf';

// --- INTERFAZ DE USUARIO ---
interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  idRol: number;
  dni: string; // <-- AGREGADO PARA EVITAR ERRORES
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    EditarUsuariosModalComponent,
    EliminarUsuariosModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  readonly rolesMap: { [key: string]: string } = {
    '3': 'Usuario',
    // Puedes agregar más roles aquí si es necesario
  };

  mostrarModalAgregar = false;
  mostrarModalEditar = false;
  mostrarModalEliminar = false;
  usuarioSeleccionado: Usuario | null = null;
  usuarioIdAEliminar: number | null = null;

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
   this.usuariosService.getUsuarios().subscribe({
  next: res => {
    console.log('Respuesta del backend:', res);
    this.usuarios = res.map((usuario: Usuario) => ({
      ...usuario,
      idRol: this.rolesMap[usuario.idRol] || usuario.idRol
    }));
  },
  error: err => console.error('Error al cargar usuarios', err)
});
  }

  trackByUsuarioId(index: number, usuario: Usuario): number {
    return usuario.id;
  }

  // --- FUNCION PARA DESCARGAR PDF ---
descargarPDF(u: Usuario) {
  const doc = new jsPDF();
  const margenX = 15;
  let margenY = 20;

  // --- Encabezado ---
  doc.setFillColor(0, 168, 157); // Verde corporativo
  doc.rect(0, 0, 210, 25, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('MEGAYUNTAS', margenX, 17);

  // Datos de contacto
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  margenY += 20;
  doc.text('Dirección: Calle Falsa 123', margenX, margenY);
  margenY += 6;
  doc.text('Teléfono: +51 987654321', margenX, margenY);
  margenY += 6;
  doc.text('Email: contacto@megayuntas.com', margenX, margenY);
  margenY += 10;

  // --- Información del Usuario ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Información del Usuario', margenX, margenY);
  margenY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`Nombre: ${u.nombres} ${u.apellidos}`, margenX, margenY);
  margenY += 6;
  doc.text(`DNI: ${u.dni || '---------'} `, margenX, margenY);
  margenY += 6;
  doc.text(`Email: ${u.email}`, margenX, margenY);
  margenY += 6;
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, margenX, margenY);
  margenY += 10;

  // Línea divisoria
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(margenX, margenY, 195, margenY);
  margenY += 10;

  // --- Términos y Condiciones (del login/register modal) ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Términos y Condiciones', margenX, margenY);
  margenY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const terminos = [
    '1. Aceptación de los Términos: Al utilizar esta aplicación, aceptas estar sujeto a estos Términos y Condiciones. Debes leerlos cuidadosamente antes de usarla.',
    '2. Registro de Usuario: Debes proporcionar información veraz y completa al registrarte. No se permiten datos falsos o suplantación de identidad.',
    '3. Uso de la Aplicación: La aplicación debe ser utilizada únicamente para fines legales. Queda prohibido el uso indebido de cualquier funcionalidad.',
    '4. Privacidad: Tus datos serán protegidos según la política de la empresa.',
    '5. Firma y Aceptación: Al aceptar, confirmas que has leído y aceptas estos términos.'
  ];
  terminos.forEach(line => {
    doc.text(line, margenX, margenY, { maxWidth: 180 });
    margenY += 10;
  });

  margenY += 10;

  // --- Confirmación de aceptación ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(0, 128, 0);
  doc.text('He leído y acepto los Términos y Condiciones', margenX, margenY);
  margenY += 8;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Nombre: ${u.nombres} ${u.apellidos}`, margenX, margenY);
  margenY += 6;
  doc.text(`DNI: ${u.dni || '---------'} `, margenX, margenY);
  margenY += 6;
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, margenX, margenY);

  // Descargar PDF
  doc.save(`${u.nombres}_${u.apellidos}_Terminos.pdf`);
}


  // --- AGREGAR ---
  abrirModalAgregar(): void {
    this.mostrarModalAgregar = true;
  }
  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false;
    this.cargarUsuarios();
  }

  // --- EDITAR ---
  abrirModalEditar(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarModalEditar = true;
  }
  cerrarModalEditar(): void {
    this.mostrarModalEditar = false;
    this.usuarioSeleccionado = null;
    this.cargarUsuarios();
  }

  // --- ELIMINAR ---
  abrirModalEliminar(usuarioId: number): void {
    this.usuarioIdAEliminar = usuarioId;
    this.mostrarModalEliminar = true;
  }
  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.usuarioIdAEliminar = null;
  }
  eliminarUsuario(id: number): void {
    if (id == null) {
      console.error('ID inválido para eliminación');
      return;
    }

    this.usuariosService.eliminarUsuario(id).subscribe({
      next: () => {
        this.cerrarModalEliminar();
        this.cargarUsuarios();
      },
      error: (err) => {
        console.error('Error al eliminar Usuario:', err);
      }
    });
  }
}
