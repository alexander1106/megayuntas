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
  // --- Estados de la Interfaz ---
  isForgotPasswordMode = false;
  mostrarModalFirma = false;
  isLoginMode = true;
  mostrarModalOTP = false;
  isLoading = false;
  showPassword = false;
  submitAttempt = false;

  // --- Modelos de Datos ---
  loginData = { email: '', password: '' };
  registerData = {
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    suscripcion: 1,
    idRol: 1,
    aceptaTerminos: false
  };

  // --- Variables Auxiliares ---
  error = '';
  username = '';
  tokenTemporal = '';
  qrCodeUrl = '';

  constructor(private authService: AuthService, private router: Router) {}

  // ==========================================================
  // 1. LOGIN (Con Parche de Seguridad)
  // ==========================================================
  onLogin(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        const status = response?.status;
        const data = response?.data;

        // 🔒 SEGURIDAD: Si el backend dice 'error' (aunque sea 200 OK), mostramos mensaje genérico
        if (status === 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Error de acceso',
            text: 'Credenciales incorrectas' // Mensaje genérico
          });
          return;
        }

        // Caso A: Requiere 2FA
        if (data?.require2FA) {
          Swal.fire({
            icon: 'info',
            title: 'Verificación 2FA',
            text: 'Se ha enviado un código a tu correo',
            confirmButtonText: 'OK'
          }).then(() => {
            this.mostrarModalOTP = true;
          });
          return;
        }

        // Caso B: Login Exitoso Directo
        if (data?.token) {
          localStorage.setItem('token', data.token);
          Swal.fire({
            icon: 'success',
            title: '¡Bienvenido!',
            text: 'Login exitoso',
            confirmButtonText: 'Continuar'
          }).then(() => this.router.navigate(['/admin']));
        }
      },
      error: (err) => {
        this.isLoading = false;

        // 🔒 SEGURIDAD: Ignoramos el mensaje del backend y mostramos uno genérico
        Swal.fire({
          icon: 'error',
          title: 'Error de acceso',
          text: 'Credenciales incorrectas' // Esto es lo que saldrá en tu captura
        });
      }
    });
  }

  // ==========================================================
  // 2. REGISTRO
  // ==========================================================

  // Valida que solo se ingresen números en el DNI
  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.key;
    // Permitir números, Backspace y Tab
    if (!/^[0-9]$/.test(charCode) && event.key !== 'Backspace' && event.key !== 'Tab') {
      event.preventDefault();
    }
  }

  onRegister() {
    this.submitAttempt = true;
    this.error = '';
    const pwd = this.registerData.password;

    // Validación: Campos vacíos
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
        text: 'Por favor, complete todos los campos.'
      });
      return;
    }

    // Validación: Complejidad Contraseña
    const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).+$/;
    if (!regex.test(pwd)) {
      this.error = 'La contraseña debe incluir al menos una mayúscula, un número y un símbolo.';
      return;
    }

    // Validación: Coincidencia Contraseñas
    if (pwd !== this.registerData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    // Validación: Términos y Condiciones
    if (!this.registerData.aceptaTerminos) {
      this.mostrarModalFirma = true;
      return;
    }

    // Enviar si todo es correcto
    this.enviarRegistro();
  }

  aceptarFirma() {
    this.mostrarModalFirma = false;
    this.registerData.aceptaTerminos = true;
    this.enviarRegistro();
  }

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
      firmaBase64: 'Acepta Términos' // Aquí iría la firma real si usaras canvas
    };

    this.isLoading = true;
    this.authService.registerUser(payload).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire('Registro exitoso', 'Tu cuenta ha sido creada correctamente.', 'success');
        this.isLoginMode = true; // Volver al login
        // Reiniciar formulario
        this.registerData = {
          nombres: '', apellidos: '', dni: '', email: '',
          password: '', confirmPassword: '', idRol: 1,
          suscripcion: 1, aceptaTerminos: false
        };
        this.submitAttempt = false;
      },
      error: (err) => {
        this.isLoading = false;
        // Aquí sí puedes mostrar el error específico porque es registro
        Swal.fire('Error al registrar', err?.error?.message || 'No se pudo crear el usuario', 'error');
      }
    });
  }

  // ==========================================================
  // 3. VERIFICACIÓN 2FA
  // ==========================================================
  verificarCodigo2FA() {
    if (!this.tokenTemporal || this.tokenTemporal.length !== 6) {
      this.error = 'Ingrese un código válido de 6 dígitos';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.verify2FA(this.tokenTemporal).subscribe({
      next: (res: any) => {
        this.isLoading = false;

        if (res.valid) {
          Swal.fire({
            icon: 'success',
            title: 'Código correcto',
            text: 'Bienvenido al sistema',
            confirmButtonText: 'Continuar'
          }).then(() => {
            const token = res.token || res.data?.token;
            if (!token) {
              this.error = 'Token no recibido del backend';
              return;
            }

            localStorage.setItem('token', token);
            this.mostrarModalOTP = false;
            this.router.navigate(['/admin']);
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

  // ==========================================================
  // 4. BÚSQUEDA DNI (RENIEC)
  // ==========================================================
  buscarDNI() {
    const dni = this.registerData.dni?.trim();

    if (!dni || dni.length !== 8) {
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

  onDNIChange() {
    if (this.registerData.dni?.length === 8) {
      this.buscarDNI();
    }
  }

  // Métodos wrapper para eventos HTML
  onDNIChangeMobile() { this.onDNIChange(); }
  onDNIEnter() { this.onDNIChange(); }

  // ==========================================================
  // 5. UTILIDADES UI
  // ==========================================================
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
