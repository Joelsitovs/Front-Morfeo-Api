import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { StorageService } from '../../core/services/storage.service';
import { ModelViewerComponent } from '../model-viewer/model-viewer.component';

@Component({
  selector: 'app-vista-previa',
  imports: [ModelViewerComponent],
  animations: [
    trigger('progressBar', [
      state('void', style({ width: '0%' })),
      state('*', style({ width: '{{width}}%' }), { params: { width: 0 } }),
      transition('* <=> *', animate('800ms cubic-bezier(0.65, 0, 0.35, 1)')),
    ]),
  ],

  templateUrl: './vista-previa.component.html',
  styleUrl: './vista-previa.component.css',
})
export class VistaPreviaComponent {
  private storageService = inject(StorageService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  previewUrl: string | null = null;

  limpiarTodo() {
    this.archivos = [];
    this.fileInput.nativeElement.value = '';
  }

  archivos: {
    file: File;
    progreso: number;
    estado: 'pendiente' | 'subiendo' | 'completado' | 'error';
    url?: string;
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

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    this.procesarArchivos(event.dataTransfer?.files || null);
  }

  onFileSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    this.procesarArchivos(target.files);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  eliminarArchivo(item: { file: File; progreso: number; estado: string }) {
    this.archivos = this.archivos.filter((a) => a !== item);
    this.fileInput.nativeElement.value = '';
  }

  simularCargaYSubir(item: any) {
    const bytes = item.file.size;
    const mb = bytes / (1024 * 1024);

    let duracionTotal = mb * 1000;
    duracionTotal = Math.max(2000, Math.min(duracionTotal, 5000));

    const pasos = 600;
    const intervalo = duracionTotal / pasos;
    let paso = 0;

    // Easing tipo ease-in-out
    const easeInOut = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    item.progreso = 0;
    item.estado = 'subiendo';

    const timer = setInterval(() => {
      paso++;
      const t = paso / pasos;
      item.progreso = Math.min(easeInOut(t) * 100, 100);

      if (paso >= pasos) {
        clearInterval(timer);
        item.progreso = 100;
        item.estado = 'completado';
        this.previewUrl = URL.createObjectURL(item.file);
        this.subirArchivo(item);
      }
    }, intervalo);
  }

  procesarArchivos(fileList: FileList | null) {
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const tiempoInicio = performance.now();

      // Esperamos un momento para simular la carga en memoria
      setTimeout(() => {
        const tiempoFin = performance.now();
        const duracionCarga = tiempoFin - tiempoInicio;

        const item: {
          file: File;
          progreso: number;
          estado: 'pendiente' | 'subiendo' | 'completado' | 'error';
          tiempoSimulado?: number;
        } = {
          file,
          progreso: 0,
          estado: 'subiendo',
          tiempoSimulado: duracionCarga || 2000,
        };

        this.archivos.push(item);
        this.simularCargaYSubir(item); // acá se anima y luego se sube
      }, 0);
    }
  }

  subirArchivo(archivo: any) {
    this.storageService.subirArchivo(archivo.file).subscribe({
      next: (res) => {
        archivo.estado = 'completado';
        archivo.url = res.url;
        console.log('Archivo subido:', res);
      },
      error: (err) => {
        archivo.estado = 'error';
        console.error('Error al subir archivo:', err);
      },
    });
  }

  usarPiezaTest(event: MouseEvent) {
    event.stopPropagation();
  }

  formatearPeso(bytes: number): string {
    const kb = bytes / 1024;
    if (kb > 1024) {
      const mb = kb / 1024;
      return `${mb.toFixed(2)} MB`;
    } else {
      return `${kb.toFixed(2)} KB`;
    }
  }
}
