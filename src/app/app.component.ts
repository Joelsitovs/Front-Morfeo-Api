import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth2Service } from './core/services/auth2.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent implements OnInit {
  title = 'morfeo3d';
  private authService = inject(Auth2Service);

  ngOnInit(): void {
    this.authService.getCSRFToken().subscribe();
    this.authService.getUser().subscribe((user) => {
      console.log('[AppComponent] Usuario cargado:', user);
    });
  }
}
