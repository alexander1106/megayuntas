import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  password: string = '';
  confirmPassword: string = '';
  token: string = '';
  loading: boolean = false;

  // Mostrar/ocultar contraseña y confirmación
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;

  // Mensajes dinámicos
  message: string = '';
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirm() {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.showMessage('⚠️ Debes completar todos los campos correctamente.', true);
      return;
    }

    if (this.password.length < 6) {
      this.showMessage('⚠️ La contraseña debe tener al menos 6 caracteres.', true);
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showMessage('❌ Las contraseñas no coinciden.', true);
      return;
    }

    this.loading = true;
    this.authService.changePassword(this.token, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.showMessage('✅ Contraseña cambiada exitosamente.', false);
        form.reset();
        setTimeout(() => this.goToLogin(), 1500);
      },
      error: () => {
        this.loading = false;
        this.showMessage('❌ Error al cambiar la contraseña. El enlace puede haber expirado.', true);
      },
    });
  }

  private showMessage(msg: string, isError: boolean) {
    this.message = msg;
    this.error = isError;
    setTimeout(() => (this.message = ''), 4000);
  }
}
