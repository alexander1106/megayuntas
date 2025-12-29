import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth/auth.service'; // Ajusta la ruta si es necesario
import Swal from 'sweetalert2';
import { QRCodeModule } from 'angularx-qrcode';

// Interfaces locales para tipado
interface LoginResponse {
  data?: {
    token?: string;
    require2FA?: boolean;
    username?: string;
  };
  message?: string;
}

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
  isLoginMode = true;
  isLoading = false;
  showPassword = false;
  mostrarModalOTP = false;

  // Datos de formularios
  loginData = {
    user: '',
    password: ''
  };

  registerData = {
    nombres: '',
    apellidos: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    suscripcion: 1, // ID numérico por defecto (Backend lo espera así)
    idRol: 1        // ID numérico por defecto
  };

  // Variables para 2FA
  username = '';
  tokenTemporal = '';
  qrCodeUrl = '';
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // --- LOGIN ---
  onLogin(form: NgForm) {
    if (form.invalid) return;
    
    this.isLoading = true;
    this.authService.login(this.loginData.user, this.loginData.password).subscribe({
      next: (response: any) => { // Puedes usar LoginResponse si tu servicio lo tipa
        console.log('🔹 Respuesta del servidor:', response);
        const data = response?.data;

        if (!data) {
          this.handleError('Respuesta inválida del servidor');
          return;
        }

        // Caso 1: Requiere 2FA
        if (data.require2FA) {
          console.log('🟡 Requiere 2FA');
          this.username = data.username || this.loginData.user;
          this.enable2FA(this.username);
          this.isLoading = false;
          return;
        }

        // Caso 2: Login Exitoso Directo
        if (data.token) {
          this.procesarLoginExitoso(data.token);
        } else {
          this.handleError('No se recibió el token de acceso');
        }
      },
      error: (err) => {
        console.error('❌ Error login:', err);
        this.handleError('Credenciales incorrectas o error de conexión');
      }
    });
  }

  // --- REGISTRO ---
  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.isLoading = true;
    this.authService.registerUser(this.registerData).subscribe({
      next: (res) => {
        console.log('✅ Usuario registrado:', res);
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Tu cuenta ha sido creada. Por favor inicia sesión.',
        });
        this.isLoginMode = true;
      },
      error: (err) => {
        console.error('❌ Error registro:', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: err.error?.message || 'No se pudo crear el usuario.'
        });
      }
    });
  }

  // --- 2FA LOGIC ---
  enable2FA(username: string) {
    this.authService.enable2FA(username).subscribe({
      next: (res: any) => {
        this.qrCodeUrl = res.otpAuthUrl;
        this.mostrarModalOTP = true;
      },
      error: (err: any) => {
        console.error('Error activando 2FA:', err);
        this.handleError('No se pudo iniciar el proceso de doble factor');
      }
    });
  }

  verificarCodigo2FA() {
    if (!this.tokenTemporal || this.tokenTemporal.length !== 6) {
      this.error = 'El código debe tener 6 dígitos';
      return;
    }

    this.authService.verify2FA(this.username, this.tokenTemporal).subscribe({
      next: (res: any) => {
        this.mostrarModalOTP = false;
        this.procesarLoginExitoso(res.token);
      },
      error: (err: any) => {
        this.error = 'Código incorrecto o expirado';
      }
    });
  }

  // --- UTILIDADES ---
  private procesarLoginExitoso(token: string) {
    localStorage.setItem('token', token);
    console.log('✅ Login exitoso');
    this.router.navigate(['/admin']);
    this.isLoading = false;
  }

  private handleError(mensaje: string) {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
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