import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../core/services/theme/theme.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar-shop',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar-shop.component.html',
  styleUrl: './navbar-shop.component.css',
})
export class NavbarShopComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private viewportScroller = inject(ViewportScroller);

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        const fragment = this.router.parseUrl(this.router.url).fragment;
        if (fragment) {
          setTimeout(() => {
            this.viewportScroller.scrollToAnchor(fragment);
          }, 100);
        }
      });
  }

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
}
