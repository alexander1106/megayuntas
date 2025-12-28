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

  loginData = { email: '', password: '' };

  registerData = {
    nombres: '',
    apellidos: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: '',
    suscripcion: 1,
    idRol: 1
  };

  error = '';
  isLoginMode = true;
  username = '';
  tokenTemporal = '';
  mostrarModalOTP = false;
  isLoading = false;
  showPassword = false;
  qrCodeUrl = '';

  constructor(private authService: AuthService, private router: Router) {}

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
        // Mostrar alerta según el mensaje que venga del backend
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message || 'Error desconocido',
        });
        return;
      }

      // Si requiere 2FA
      if (data?.require2FA) {
        this.username = data.username;
        this.enable2FA(data.username);
        Swal.fire({
          icon: 'info',
          title: 'Verificación 2FA',
          text: 'Se requiere autenticación de dos factores',
        });
        return;
      }

      // Si el login es correcto
      if (data?.token) {
        localStorage.setItem('token', data.token);

        Swal.fire({
          icon: 'success',
          title: '¡Bienvenido!',
          text: 'Login exitoso',
          confirmButtonText: 'Continuar'
        }).then(() => {
          this.router.navigate(['/admin']); // Navegar al panel
        });
      }
    },
    error: (err) => {
      this.isLoading = false;

      // Si el backend devuelve un error no manejado
      const backendMessage = err?.error?.message || 'Credenciales incorrectas o error en el servidor';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: backendMessage,
      });
    }
  });
}



  // REGISTRO
  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.registerUser(this.registerData).subscribe({
      next: () => {
        Swal.fire('Registro exitoso', 'Tu cuenta ha sido creada correctamente.', 'success');
        this.isLoginMode = true;
      },
      error: () => {
        Swal.fire('Error al registrar', 'No se pudo crear el usuario. Inténtalo nuevamente.', 'error');
      },
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // 2FA
  verificarCodigo2FA() {
    if (!this.tokenTemporal || this.tokenTemporal.length !== 6) {
      this.error = 'Ingrese un código válido de 6 dígitos';
      return;
    }

    this.authService.verify2FA(this.username, this.tokenTemporal).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.mostrarModalOTP = false;
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.error = 'Código 2FA incorrecto o expirado';
      }
    });
  }

  enable2FA(username: string) {
    this.authService.enable2FA(username).subscribe({
      next: (res: any) => {
        this.qrCodeUrl = res.otpAuthUrl;
        this.mostrarModalOTP = true;
      },
      error: () => Swal.fire('Error', 'No se pudo activar el 2FA', 'error')
    });
  }

  // Autocompletar DNI
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

  onDNIChange() {
    if (this.registerData.dni.length === 8) this.buscarDNI();
  }
}
