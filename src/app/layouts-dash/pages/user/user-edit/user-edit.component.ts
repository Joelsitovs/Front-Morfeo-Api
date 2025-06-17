import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  imports: [
    ReactiveFormsModule,

    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgForOf,
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent implements OnInit {
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  compareRoles = (a: string, b: string) => a === b;
  availableRoles = ['admin', 'usuario'];

  userId!: number;
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roles: [[] as string[]],
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    this.apiService.getUsers().subscribe((usuarios) => {
      const usuario = usuarios.find((u) => u.id === this.userId);
      if (usuario) {
        this.form.patchValue(usuario);
      }
    });
  }

  guardar() {
    if (this.form.invalid) return;

    const formData = {
      name: this.form.value.name ?? undefined,
      email: this.form.value.email ?? undefined,
      role: this.form.value.roles ?? [],
    };
    console.log('Payload:', formData);

    this.apiService.updateUser(this.userId, formData).subscribe({
      next: () => this.router.navigate(['/dashboard/usuarios']),
      error: (err) => console.error('Error al actualizar', err),
    });
  }
}
