import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormsModule,
  FormGroup,
  Validators,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Auth2Service } from '../../../core/services/auth2.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent {
  public form: FormGroup;
  private router = inject(Router);
  public errorMessage: string | undefined;
  public showPassword = false;
  private auth = inject(Auth2Service);
  private route = inject(ActivatedRoute);

  constructor() {
    this.form = new FormGroup({
      email: new FormControl('alanjoelt43@gmail.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('admin1234', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  get email() {
    return this.form.get('email') as FormControl;
  }

  get password() {
    return this.form.get('password') as FormControl;
  }

  tooglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  preventBlur(event: MouseEvent): void {
    event.preventDefault(); // <- clave
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('[LoginComponent] Enviando login con:', this.form.value);

    this.auth.login(this.form.value).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        } else {
          this.errorMessage = 'Credenciales inválidas o error en login.';
        }
      },
      error: (error) => {
        console.error('[LoginComponent] Error inesperado en login:', error);
        this.errorMessage = 'Hubo un problema. Intentalo más tarde.';
      },
    });
  }

  signInWithGoogle() {
    this.auth.signInWithGoogle();
  }
}
