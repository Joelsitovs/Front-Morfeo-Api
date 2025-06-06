import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent {
  /*ngOnInit(): void {
    this.authService.login({
      email: 'test@example.com',
      password: 'password',
    }).subscribe({
      next: () => {
        console.log('Login OK');

        this.authService.getUser().subscribe({
          next: (user) => console.log('Usuario logueado:', user),
          error: (err) => console.error('Error al obtener user:', err),
        });

        this.authService.getOla().subscribe({
          next: (res) => console.log('Ruta protegida OK:', res),
          error: (err) => console.error('Error en ruta protegida:', err),
        });
      },
      error: (err) => console.error('Login error:', err),
    });
  }*/
}
