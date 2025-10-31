import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import Swal from 'sweetalert2';
import { QRCodeModule } from 'angularx-qrcode';

declare const google: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, QRCodeModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  isForgotPasswordMode: boolean = false;

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
  suscripcion: 1,
  idRol:1

};
  error = '';
  isLoginMode = true;
  username = '';
  tokenTemporal = '';
  mostrarModalOTP = false;
  isLoading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Login tradicional
onLogin(form: NgForm) {
  if (form.invalid) return;
  this.isLoading = true;
  this.authService.login(this.loginData.user, this.loginData.password).subscribe({
    next: (response: any) => {
      console.log('🔹 Respuesta del servidor:', response);
      const data = response?.data;
      if (!data) {
        console.error('❌ No hay data en la respuesta del backend.');
        this.isLoading = false;
        return;
      }
      // 🟡 Caso: requiere 2FA → mostrar QR
    if (data.require2FA) {
  console.log('🟡 Usuario requiere 2FA, mostrando QR...');
  this.username = data.username; // ✅ usar el username, no el email
  this.enable2FA(data.username);          // ✅ correcto
  this.isLoading = false;
  return;
}
      // 🟢 Caso: NO requiere 2FA → guardar token y redirigir
      if (data.token) {
        console.log('✅ Token recibido, guardando y redirigiendo...');
        localStorage.setItem('token', data.token);
        this.router.navigate(['/admin']).then(success => {
          console.log('➡️ Navegación a dashboard:', success);
        });
      } else {
        console.warn('⚠️ No se recibió token válido del backend.');
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      console.error('❌ Error al iniciar sesión:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de autenticación',
        text: 'Credenciales incorrectas o error en el servidor.'
      });
    }
  });
}


  // Registro básico
onRegister() {
  if (this.registerData.password !== this.registerData.confirmPassword) {
    this.error = 'Las contraseñas no coinciden';
    return;
  }

  console.log('Datos de registro:', this.registerData);

  this.authService.registerUser(this.registerData).subscribe({
    next: (res) => {
      console.log('✅ Usuario registrado:', res);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'Tu cuenta ha sido creada correctamente.',
      });
      // Puedes redirigir o volver al login
      this.isLoginMode = true;
    },
    error: (err) => {
      console.error('❌ Error en registro:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error al registrar',
        text: 'No se pudo crear el usuario. Inténtalo nuevamente.',
      });
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
    error: (err) => {
      this.error = 'Código 2FA incorrecto o expirado';
    }
  });
}
qrCodeUrl: string = '';

enable2FA(username: string) {
  this.authService.enable2FA(username).subscribe({
    next: (res: any) => { // 👈 aquí agregas "any"
      console.log('Respuesta del backend:', res);
      this.qrCodeUrl = res.otpAuthUrl;
      this.mostrarModalOTP = true;
    },
    error: (err) => {
      console.error(err);
      Swal.fire('Error', 'No se pudo activar el 2FA', 'error');
    }
  });
  }
}
