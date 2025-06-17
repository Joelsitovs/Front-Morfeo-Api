import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth2Service } from '../../../../core/services/auth2.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, NgIf, ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
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
    event.preventDefault();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log('[LoginComponent] Enviando login con:', this.form.value);

    this.auth.register(this.form.value).subscribe({
      next: (user) => {
        if (user) {
          this.router.navigate(['/dashboard/pedidos'], { replaceUrl: true });
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
