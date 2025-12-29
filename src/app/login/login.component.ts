import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import Swal from 'sweetalert2';

// Asegúrate de que la ruta sea correcta
import { AuthService } from '../service/auth/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QRCodeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // --- Estados de la Vista ---
  isLoginMode = true;
  isLoading = false;
  showPassword = false;
  mostrarModalOTP = false;
  error = '';

  // --- Datos para 2FA ---
  username = '';
  tokenTemporal = '';
  qrCodeUrl = '';

  // --- Modelos de Datos ---
  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
    suscripcion: 1,
    idRol: 1
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ==========================================================
  // 1. LOGIN (Con soporte 2FA)
  // ==========================================================
  onLogin(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        // Validar si el backend envió un estado de error lógico
        if (response?.status === 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Error de acceso',
            text: response.message || 'Error desconocido',
          });
          return;
        }

        const data = response?.data;

        // CASO A: Requiere Autenticación de Dos Factores (2FA)
        if (data?.require2FA) {
          this.username = data.username;
          this.enable2FA(data.username); // Prepara el QR
          Swal.fire({
            icon: 'info',
            title: 'Verificación 2FA',
            text: 'Se requiere autenticación de dos factores.',
            timer: 2000,
            showConfirmButton: false
          });
          return;
        }

        // CASO B: Login Directo Exitoso
        if (data?.token) {
          this.finalizarLogin(data.token);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Credenciales incorrectas o error de servidor';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
    });
  }

  // ==========================================================
  // 2. REGISTRO (Con búsqueda DNI)
  // ==========================================================
  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.authService.registerUser(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu cuenta ha sido creada. Por favor inicia sesión.'
        });
        this.isLoginMode = true; // Cambiar a vista de login
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', 'No se pudo registrar el usuario. Verifique los datos.', 'error');
      },
    });
  }

  // --- Búsqueda RENIEC (Auto-rellenado) ---
  buscarDNI() {
    const dni = this.registerData.dni.trim();
    if (dni.length !== 8) return; // Validación silenciosa o usar alerta si prefiere

    this.isLoading = true;
    this.authService.getUserByDNI(dni).subscribe({
      next: (res: any) => {
        // Asignamos nombres encontrados al formulario
        this.registerData.nombres = res.nombres || res.names || '';
        this.registerData.apellidos = res.apellidos || res.surnames || '';
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Aviso', 'No se encontraron datos para este DNI', 'info');
        this.registerData.nombres = '';
        this.registerData.apellidos = '';
      }
    });
  }

  onDNIChange() {
    if (this.registerData.dni.length === 8) {
      this.buscarDNI();
    }
  }

  // ==========================================================
  // 3. LÓGICA 2FA (QR y Verificación)
  // ==========================================================
  enable2FA(username: string) {
    this.authService.enable2FA(username).subscribe({
      next: (res: any) => {
        this.qrCodeUrl = res.otpAuthUrl; // URL para generar el QR en el HTML
        this.mostrarModalOTP = true;
      },
      error: () => Swal.fire('Error', 'No se pudo generar el código QR', 'error')
    });
  }

  verificarCodigo2FA() {
    if (!this.tokenTemporal || this.tokenTemporal.length !== 6) {
      this.error = 'Ingrese un código de 6 dígitos';
      return;
    }

    this.authService.verify2FA(this.username, this.tokenTemporal).subscribe({
      next: (res: any) => {
        if (res.token) {
          this.mostrarModalOTP = false;
          this.finalizarLogin(res.token);
        }
      },
      error: () => {
        this.error = 'Código incorrecto o expirado';
      }
    });
  }

  // ==========================================================
  // 4. UTILIDADES
  // ==========================================================
  
  // Función centralizada para guardar token y redirigir
  private finalizarLogin(token: string) {
    localStorage.setItem('token', token);
    Swal.fire({
      icon: 'success',
      title: '¡Bienvenido!',
      text: 'Acceso correcto',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      this.router.navigate(['/admin']);
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}