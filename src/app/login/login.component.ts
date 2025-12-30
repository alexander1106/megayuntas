import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import Swal from 'sweetalert2';
import { QRCodeModule } from 'angularx-qrcode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QRCodeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isForgotPasswordMode = false;
  mostrarModalFirma = false;

  loginData = { email: '', password: '' };
  registerData = {
    nombres: '', apellidos: '', dni: '', email: '',
    password: '', confirmPassword: '', suscripcion: 1, idRol: 1,
    aceptaTerminos: false
  };
  error = '';
  isLoginMode = true;
  username = '';
  tokenTemporal = '';
  mostrarModalOTP = false;
  isLoading = false;
  showPassword = false;
  qrCodeUrl = '';
  submitAttempt = false;

  constructor(private authService: AuthService, private router: Router) {}

  // -------------------- LOGIN --------------------
  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        const status = response?.status;
        const message = response?.message;
        const data = response?.data;

        if (status === 'error') {
          Swal.fire({ icon: 'error', title: 'Error', text: message || 'Error desconocido' });
          return;
        }
if (data?.require2FA) {
  Swal.fire({
    icon: 'info',
    title: 'Verificación 2FA',
    text: 'Se ha enviado un código a tu correo',
    confirmButtonText: 'OK'
  }).then(() => {
    this.mostrarModalOTP = true; // modal solo después de OK
  });
  return;
}


        if (data?.token) {
          localStorage.setItem('token', data.token);
          Swal.fire({ icon: 'success', title: '¡Bienvenido!', text: 'Login exitoso', confirmButtonText: 'Continuar' })
            .then(() => this.router.navigate(['/admin']));
        }
      },
      error: (err) => {
        this.isLoading = false;
        const backendMessage = err?.error?.message || 'Credenciales incorrectas o error en el servidor';
        Swal.fire({ icon: 'error', title: 'Error', text: backendMessage });
      }
    });
  }

// Agrega dentro de LoginComponent
aceptarFirma() {
  this.mostrarModalFirma = false;
  this.registerData.aceptaTerminos = true;
  this.enviarRegistro();
}
onlyNumbers(event: KeyboardEvent) {
  const charCode = event.key;
  if (!/^[0-9]$/.test(charCode)) {
    event.preventDefault();
  }
}


onRegister() {
  this.submitAttempt = true;
  this.error = '';
    const pwd = this.registerData.password;

 // Validar longitud máxima y criterios
 // Validar longitud máxima y criterios
const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/; // obligatorio mayúscula, número, símbolo
if (!regex.test(pwd)) {
  this.error = 'La contraseña debe incluir al menos una mayúscula, un número y un símbolo.';
  return;
}


  if (pwd !== this.registerData.confirmPassword) {
    this.error = 'Las contraseñas no coinciden';
    return;
  }

  // Validar aceptación de términos
  if (!this.registerData.aceptaTerminos) {
    this.mostrarModalFirma = true;
    return;
  }

  // Validar que todos los campos estén llenos
  if (
    !this.registerData.nombres.trim() ||
    !this.registerData.apellidos.trim() ||
    !this.registerData.dni.trim() ||
    !this.registerData.email.trim() ||
    !this.registerData.password ||
    !this.registerData.confirmPassword
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor, complete todos los campos antes de continuar.'
    });
    return; // ⚠️ Salir sin abrir el modal
  }

  // Validar que las contraseñas coincidan
  if (this.registerData.password !== this.registerData.confirmPassword) {
    this.error = 'Las contraseñas no coinciden';
    return;
  }

  // Abrir modal de Términos solo si aún no aceptó
  if (!this.registerData.aceptaTerminos) {
    this.mostrarModalFirma = true;  // ✅ Abrir modal de Términos
    return;
  }

  // Si todo está bien y aceptó términos, enviar al backend
  this.enviarRegistro();
}

  // Función para cerrar el modal
  cerrarModalFirma() {
    this.mostrarModalFirma = false;
  }
  enviarRegistro() {
    const payload = {
      nombres: this.registerData.nombres.trim(),
      apellidos: this.registerData.apellidos.trim(),
      email: this.registerData.email.trim(),
      password: this.registerData.password,
      dni: this.registerData.dni.trim(),
      idRol: this.registerData.idRol,
      firmaBase64: 'Acepta Términos' // Solo indicamos que aceptó los términos
    };

    this.isLoading = true;
    this.authService.registerUser(payload).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('Registro exitoso', 'Tu cuenta ha sido creada correctamente.', 'success');
        this.isLoginMode = true;
        this.registerData = {
          nombres: '', apellidos: '', dni: '', email: '', password: '', confirmPassword: '', idRol: 1, suscripcion: 1, aceptaTerminos: false
        };
        this.submitAttempt = false;
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire('Error al registrar', err?.error?.message || 'No se pudo crear el usuario', 'error');
      }
    });
  }

  toggleMode() { this.isLoginMode = !this.isLoginMode; this.error = ''; }
  togglePasswordVisibility() { this.showPassword = !this.showPassword; }

  // -------------------- 2FA --------------------
// login.component.ts
verificarCodigo2FA() {
  if (!this.tokenTemporal || this.tokenTemporal.length !== 6) {
    this.error = 'Ingrese un código válido de 6 dígitos';
    return;
  }

  this.isLoading = true;
  this.error = '';

this.authService.verify2FA(this.tokenTemporal).subscribe({
  next: (res: any) => {
    console.log('Respuesta 2FA:', res); // 🔹 Ver qué viene exactamente
    this.isLoading = false;
    if (res.valid) {
      Swal.fire({
        icon: 'success',
        title: 'Código correcto',
        text: 'Bienvenido al sistema',
        confirmButtonText: 'Continuar'
      }).then(() => {
        // 🔹 Asegúrate de usar la propiedad correcta
        const token = res.token || res.data?.token;
        if (!token) {
          this.error = 'Token no recibido del backend';
          return;
        }

        localStorage.setItem('token', token);
        this.mostrarModalOTP = false;
        this.router.navigate(['/admin']); // redirigir al dashboard
      });
    } else {
      this.error = 'Código 2FA incorrecto';
    }
  },
  error: () => {
    this.isLoading = false;
    this.error = 'Error al verificar el código';
  }
});

}

onDNIChangeMobile() {
  if (this.registerData.dni?.length === 8) {
    this.buscarDNI();
  }
}

buscarDNI() {
  const dni = this.registerData.dni.trim();

  if (dni.length !== 8) {
    Swal.fire('Error', 'El DNI debe tener 8 dígitos', 'warning');
    return;
  }

  this.isLoading = true;

  this.authService.getUserByDNI(dni).subscribe({
    next: (res: any) => {
      this.registerData.nombres = res.names || '';
      this.registerData.apellidos = res.surnames || '';
      this.isLoading = false;
    },
    error: () => {
      Swal.fire('Error', 'No se encontraron datos para este DNI', 'error');
      this.registerData.nombres = '';
      this.registerData.apellidos = '';
      this.isLoading = false;
    }
  });
}


  onDNIChange() { if (this.registerData.dni.length === 8) this.buscarDNI(); }
onDNIEnter() {
  if (this.registerData.dni?.length === 8) {
    this.buscarDNI();
  }
}}
