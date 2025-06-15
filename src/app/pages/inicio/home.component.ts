import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  LucideAngularModule,
  Zap,
  Printer,
  PenTool,
  Scan,
  Plus,
} from 'lucide-angular';

import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Router, RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MaterialBase } from '../../interfaces/material';
import { ApiService } from '../../core/services/api.service';

gsap.registerPlugin(ScrollToPlugin);

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, NgOptimizedImage, LucideAngularModule],
  animations: [
    trigger('progressBar', [
      state('*', style({ width: '{{ width }}%' }), { params: { width: 0 } }),
      transition('* => *', [animate('400ms ease-in-out')]),
    ]),
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent implements AfterViewInit {
  readonly Zap = Zap;
  readonly Printer = Printer;
  readonly PenTool = PenTool;
  readonly Scan = Scan;
  readonly Plus = Plus;

  imageSrc = '/assets/images/robot-white-4-640.webp';

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.imageSrc = '/assets/images/robot-white-4-256.webp';
          } else if (result.breakpoints[Breakpoints.Small]) {
            this.imageSrc = '/assets/images/robot-white-4-384.webp';
          } else if (result.breakpoints[Breakpoints.Medium]) {
            this.imageSrc = '/assets/images/robot-white-4-640.webp';
          } else {
            this.imageSrc = '/assets/images/robot-white-4.webp'; // 1280px
          }
        }
      });
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('presentacion') presentacion!: ElementRef;
  @ViewChild('titulo') titulo!: ElementRef;
  @ViewChild('descripcion') descripcion!: ElementRef;
  @ViewChild('botones') botones!: ElementRef;
  private router = inject(Router);
  private apiService = inject(ApiService);
  materials: MaterialBase[] = [];

  ngAfterViewInit() {
    this.apiService.getMaterials().subscribe((res) => {
      console.log(res);
      this.materials = res;
    });


    gsap.from(this.titulo.nativeElement, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from(this.descripcion.nativeElement, {
      opacity: 0,
      y: 30,
      delay: 0.3,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from(this.botones.nativeElement.children, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      stagger: 0.2,

      ease: 'power1.out',
    });
  }
}
