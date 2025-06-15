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

type EstadoArchivo = 'pendiente' | 'subiendo' | 'completado' | 'error';

interface ArchivoItem {
  file: File;
  progreso: number;
  estado: 'pendiente' | 'subiendo' | 'completado' | 'error';
  localUrl: string;
  remoteUrl?: string;
}


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
  archivos: ArchivoItem[] = [];

  isDragging = false;

  limpiarTodo() {
    this.archivos.forEach((item) => URL.revokeObjectURL(item.localUrl));
    this.archivos = [];
    this.previewUrl = null;
    this.fileInput.nativeElement.value = '';
  }

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

  eliminarArchivo(item: ArchivoItem) {
    URL.revokeObjectURL(item.localUrl);
    this.archivos = this.archivos.filter((a) => a !== item);

    if (this.previewUrl === item.localUrl) {
      this.previewUrl = this.archivos.length
        ? this.archivos[this.archivos.length - 1].localUrl
        : null;
    }

    this.fileInput.nativeElement.value = '';
  }


  seleccionarArchivo(item: ArchivoItem) {
    this.previewUrl = item.localUrl;
  }

  simularCargaYSubir(item: ArchivoItem) {
    const bytes = item.file.size;
    const mb = bytes / (1024 * 1024);

    let duracionTotal = mb * 1000;
    duracionTotal = Math.max(2000, Math.min(duracionTotal, 5000));

    const pasos = 600;
    const intervalo = duracionTotal / pasos;
    let paso = 0;

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
        this.subirArchivo(item);
      }
    }, intervalo);
  }

  procesarArchivos(fileList: FileList | null) {
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const localUrl = URL.createObjectURL(file);

      const item: ArchivoItem = {
        file,
        progreso: 0,
        estado: 'pendiente',
        localUrl,
      };

      this.archivos.push(item);

      if (!this.previewUrl) {
        this.previewUrl = localUrl;
      }

      this.simularCargaYSubir(item);
    }
  }

  subirArchivo(archivo: ArchivoItem) {
    this.storageService.subirArchivo(archivo.file).subscribe({
      next: (res) => {
        archivo.estado = 'completado';
        archivo.remoteUrl = res.url; // mantenemos localUrl para el visor
      },
      error: (err) => {
        archivo.estado = 'error';
        console.error('Error al subir archivo:', err);
      },
    });
  }
  get archivoSeleccionado(): File | null {
    const item = this.archivos.find((a) => a.localUrl === this.previewUrl);
    return item?.file || null;
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
