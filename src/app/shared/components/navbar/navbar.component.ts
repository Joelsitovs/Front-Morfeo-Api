import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme/theme.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
})
export class NavbarComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);

  login() {
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get currentTheme() {
    return this.themeService.currentTheme;
  }
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    console.log('[NavbarComponent] Menu desplegado:', this.isMobileMenuOpen);
  }
  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
  onMenuClick(event: MouseEvent) {
    event.stopPropagation();
  }
  /*
    toogleTheme() {
      const html = document.querySelector('html');
      const isDark = html?.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  */
}
