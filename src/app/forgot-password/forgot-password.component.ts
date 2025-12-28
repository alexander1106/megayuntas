import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../service/auth/auth.service';
import Swal from 'sweetalert2'; // ✅ Importa SweetAlert2

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

onSubmit(form: NgForm) {
  if (form.invalid) return;

  this.loading = true;

  this.authService.forgotPassword(this.email).subscribe({
    next: () => {
      this.loading = false;

      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Se ha enviado un enlace de recuperación a tu correo electrónico.',
        confirmButtonColor: '#00A89D',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        form.reset();
      });
    },

    error: (err) => {
      this.loading = false;
      console.error(err);

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar el correo. Intenta nuevamente.',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Cerrar',
      });
    },
  });
}


}
