import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth/auth.service'; // Ajusta la ruta a tu servicio
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
  // Estados de vista
  isLoginMode = true;
  isForgotPasswordMode = false;
  isLoading = false;
  showPassword = false;
  mostrarModalOTP = false;
  
  // Variables 2FA
  username = '';
  tokenTemporal = '';
  qrCodeUrl = '';
  error = '';

  // Modelos de datos
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
  // LÓGICA DE LOGIN
  // ==========================================================
  onLogin(form: NgForm) {
    if (form.invalid) return;
    
    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        
        // 1. Verificar errores lógicos del backend
        if (response?.status === 'error') {
          Swal.fire({
            icon: 'error',
            title: 'Error de acceso',
            text: response.message || 'Error desconocido',
          });
          return;
        }

        const data = response?.data;

        // 2. Verificar si requiere 2FA
        if (data?.require2FA) {
          this.username = data.username;
          this.enable2FA(data.username);
          Swal.fire({
            icon: 'info',
            title: 'Seguridad',
            text: 'Se requiere verificación de dos pasos',
            timer: 2000,
            showConfirmButton: false
          });
          return;
        }

        // 3. Login Exitoso Directo
        if (data?.token) {
          localStorage.setItem('token', data.token);
          this.redirigirAlAdmin();
        }
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err?.error?.message || 'Credenciales incorrectas o servidor no disponible';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
    });
  }

  // ==========================================================
  // LÓGICA DE REGISTRO
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
        this.isLoginMode = true; // Volver al login
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        Swal.fire('Error', 'No se pudo registrar el usuario. Verifique los datos.', 'error');
      },
    });
  }

  // --- BÚSQUEDA RENIEC (DNI) ---
  buscarDNI() {
    const dni = this.registerData.dni.trim();
    if (dni.length !== 8) {
      Swal.fire('Atención', 'El DNI debe tener 8 dígitos', 'warning');
      return;
    }

    this.isLoading = true;
    // Asegúrate de que tu AuthService tenga este método implementado
    this.authService.getUserByDNI(dni).subscribe({
      next: (res: any) => {
        this.registerData.nombres = res.nombres || res.names || '';
        this.registerData.apellidos = res.apellidos || res.surnames || '';
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Swal.fire('Aviso', 'No se encontraron datos para este DNI', 'info');
        // Limpiamos nombres para que el usuario los ingrese manual si falla
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
  // LÓGICA 2FA
  // ==========================================================
  enable2FA(username: string) {
    this.authService.enable2FA(username).subscribe({
      next: (res: any) => {
        this.qrCodeUrl = res.otpAuthUrl;
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
        localStorage.setItem('token', res.token);
        this.mostrarModalOTP = false;
        this.redirigirAlAdmin();
      },
      error: () => {
        this.error = 'Código incorrecto o expirado';
      }
    });
  }

  // ==========================================================
  // UTILIDADES UI
  // ==========================================================
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private redirigirAlAdmin() {
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
}