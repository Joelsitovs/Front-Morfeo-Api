import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
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

gsap.registerPlugin(ScrollToPlugin);

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, NgOptimizedImage],
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
  imageSrc = '/assets/images/robot-white-4-640.webp';

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
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
  showImage = false;
  private router = inject(Router);

  ngAfterViewInit() {
    setTimeout(() => {
      this.showImage = true;
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

  limpiarTodo() {
    this.archivos = [];
  }

  archivos: {
    file: File;
    progreso: number;
    estado: 'pendiente' | 'subiendo' | 'completado';
  }[] = [];

  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  procesarArchivos(fileList: FileList | null) {
    if (!fileList) return;
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const item: {
        file: File;
        progreso: number;
        estado: 'pendiente' | 'subiendo' | 'completado';
      } = {
        file,
        progreso: 0,
        estado: 'subiendo',
      };
      this.archivos.push(item);

      this.simularSubida(item);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    this.procesarArchivos(event.dataTransfer?.files || null);
  }

  usarPiezaTest(event: MouseEvent) {
    event.stopPropagation();
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    this.procesarArchivos(target.files);
  }

  eliminarArchivo(item: { file: File; progreso: number; estado: string }) {
    this.archivos = this.archivos.filter((a) => a !== item);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  simularSubida(archivo: any) {
    const inicio = performance.now();
    const duracion = 3000; // 4 segundos

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const animar = (tiempoActual: number) => {
      const tiempoTranscurrido = tiempoActual - inicio;
      const progresoBruto = tiempoTranscurrido / duracion;
      const progresoEase = easeInOut(Math.min(progresoBruto, 1));
      archivo.progreso = Math.floor(progresoEase * 100);

      if (archivo.progreso < 100) {
        requestAnimationFrame(animar);
      } else {
        archivo.progreso = 100;
        archivo.estado = 'completado';
        this.router.navigate(['/vista-previa']);
      }
    };

    requestAnimationFrame(animar);
  }

  servicios = [
    {
      iconurl:
        'https://firebasestorage.googleapis.com/v0/b/pf25-alain-joel.firebasestorage.app/o/morfeo3d%2FImagen1%20(1).webp?alt=media&token=ec3b343d-e091-4f25-92d2-30d2c2d95ac2',
      title: 'Impresión 3D Personalizada',
      description:
        ' Ofrecemos servicios de impresión 3D personalizados para satisfacer tus necesidades específicas. Desde prototipos hasta piezas únicas, estamos aquí para ayudarte a dar vida a tus ideas.',
    },
    {
      iconurl:
        'https://firebasestorage.googleapis.com/v0/b/pf25-alain-joel.firebasestorage.app/o/morfeo3d%2FImagen2%20(1)%20(1).webp?alt=media&token=a1778239-e59e-4112-8b07-c13aaf759363',
      title: 'Diseño 3D Personalizado',
      description:
        'Nuestro equipo de expertos en diseño 3D está listo para crear modelos personalizados que se adapten a tus requisitos. Ya sea para productos, piezas o proyectos creativos, estamos aquí para ayudarte a materializar tus ideas.',
    },
    {
      iconurl:
        'https://firebasestorage.googleapis.com/v0/b/pf25-alain-joel.firebasestorage.app/o/morfeo3d%2FImagen3%20(1).webp?alt=media&token=71fe66f2-729a-48b2-8f3d-71230b338112',
      title: 'Escaneo 3D',
      description:
        'Ofrecemos servicios de escaneo 3D de alta precisión para capturar objetos y crear modelos digitales detallados. Ideal para ingeniería inversa, diseño y documentación de piezas existentes.',
    },
    {
      iconurl:
        'https://firebasestorage.googleapis.com/v0/b/pf25-alain-joel.firebasestorage.app/o/morfeo3d%2FImagen4%20(1).webp?alt=media&token=98689bd9-1d2f-42b7-b223-4aff3843e57a',
      title: 'Prototipado Rápido',
      description:
        'Nuestro servicio de prototipado rápido te permite transformar tus ideas en prototipos funcionales en tiempo récord. Acelera el proceso de desarrollo de productos con nuestra tecnología avanzada.',
    },
  ];
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
