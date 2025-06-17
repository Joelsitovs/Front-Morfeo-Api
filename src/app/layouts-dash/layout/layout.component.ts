import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LucideAngularModule, PenTool, Users, Package, Settings ,AlignJustify} from 'lucide-angular';
import { NgStyle } from '@angular/common';
import { Auth2Service } from '../../core/services/auth2.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, LucideAngularModule, RouterLink, NgStyle],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  readonly PenTool = PenTool;
  readonly Users = Users;
  readonly Package = Package;
  readonly AlignJustify = AlignJustify;

  menuAbierto = true;
  isAdmin = false;

  private authService = inject(Auth2Service);
  private router = inject(Router);

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.isAdmin = user?.roles?.includes('admin') ?? false;
    const savedState = localStorage.getItem('menuAbierto');
    this.menuAbierto = savedState !== null ? JSON.parse(savedState) : true;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
    localStorage.setItem('menuAbierto', JSON.stringify(this.menuAbierto));
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  protected readonly Settings = Settings;
}
