import { Component, inject } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { Auth2Service } from '../../core/services/auth2.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private authService = inject(Auth2Service);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login'],);
    });
  }
}
