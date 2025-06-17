import { Component, ElementRef, inject, ViewChild } from '@angular/core';

import { StorageService } from '../../../core/services/storage.service';
import { ModelViewerComponent } from '../model-viewer/model-viewer.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Visor3dService } from '../../../core/services/visor3d.service';
import { ApiService } from '../../../core/services/api.service';
import { MaterialBase } from '../../../interfaces/material';
import { LucideAngularModule, ShoppingCart } from 'lucide-angular';
import { CheckoutService } from '../../../core/services/checkout.service';

interface ArchivoItem {
  file: File;
  filename: string;
  localUrl: string;
  materials?: MaterialBase[];
  material?: MaterialBase;
  color?: string;
  advanced?: boolean;
  colors?: string[];
  thumbnail?: string;
  dimensions?: string;
  cantidad?: number;

  volumen?: number;
  precioEstimado?: number;
  thumbnailLoaded?: boolean;
  dimensionsLoaded?: boolean;
  loaded: boolean;
}

@Component({
  selector: 'app-vista-previa',
  imports: [FormsModule, CommonModule, LucideAngularModule],
  standalone: true,
  templateUrl: './vista-previa.component.html',
  styleUrl: './vista-previa.component.css',
})
export class VistaPreviaComponent {
  readonly ShoppingCart = ShoppingCart;

  private storageService = inject(StorageService);
  private dialog = inject(MatDialog);
  private visor3d = inject(Visor3dService);
  private api = inject(ApiService);
  private checkout = inject(CheckoutService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  archivos: ArchivoItem[] = [];
  previewUrl: string | null = null;
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
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    this.procesarArchivos(input.files);

    input.value = '';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  eliminarArchivo(archivoAEliminar: ArchivoItem): void {
    this.archivos = this.archivos.filter(
      (archivo) => archivo !== archivoAEliminar
    );
  }

  private dataUrlToBlob(dataUrl: string): Promise<Blob> {
    return fetch(dataUrl).then((res) => res.blob());
  }

  procesarArchivos(fileList: FileList | null) {
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const localUrl = URL.createObjectURL(file);

      const item: ArchivoItem = {
        file,
        filename: file.name,
        localUrl,
        loaded: false,
        thumbnailLoaded: false,
        cantidad: 1,
        dimensionsLoaded: false,
      };
      this.archivos.push(item);

      // Miniatura
      this.visor3d.generateThumbnail(file).then(async (thumbnailBase64) => {
        try {
          const blob = await this.dataUrlToBlob(thumbnailBase64);
          const path = `morfeo3d/archivos/${Date.now()}-${item.filename}.png`;

          const downloadUrl = await this.storageService.subirBlob(path, blob);

          item.thumbnail = downloadUrl;
          item.thumbnailLoaded = true;
          this.actualizarEstadoCarga(item);
        } catch (error) {
          console.error('Error subiendo miniatura a Firebase:', error);
        }
      });

      // Dimensiones + volumen + precio
      this.visor3d
        .calcularPropiedades(file)
        .then(({ dimensiones, volumen }) => {
          item.dimensions = dimensiones;
          item.volumen = volumen;
          item.dimensionsLoaded = true;
          this.actualizarEstadoCarga(item);
        });

      if (!this.previewUrl) this.previewUrl = localUrl;
    }
  }

  usarPiezaTest(event: any) {
    event.stopPropagation();

    const url =
      'https://firebasestorage.googleapis.com/v0/b/pf25-alain-joel.firebasestorage.app/o/morfeo3d%2Farchivos%2FEspeon.stl?alt=media&token=3ebf56bd-7661-4c55-a673-2a1ddc3de857';

    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'Espeon.stl', { type: 'model/stl' });
        const fileList = {
          0: file,
          length: 1,
          item: (index: number) => file,
        } as FileList;

        this.procesarArchivos(fileList);
      })
      .catch((err) => console.error('Error al cargar STL de test:', err));
  }

  getPrecioTotal(): number {
    return this.archivos.reduce((total, archivo) => {
      const volumen = archivo.volumen ?? 0;
      const cantidad = archivo.cantidad ?? 1;
      const precioPorCm3 = archivo.material?.price ?? 0;

      return total + volumen * precioPorCm3 * cantidad;
    }, 0);
  }

  actualizarEstadoCarga(item: ArchivoItem) {
    if (item.thumbnailLoaded && item.dimensionsLoaded) {
      item.loaded = true;
      this.cargarOpcionesMaterial(item);
    }
  }

  openDeviceConfigDialog(file: File, modelUrl: string): void {
    const dialogRef = this.dialog.open(ModelViewerComponent, {
      width: '1000px',
      autoFocus: false,
      panelClass: 'makeItMiddle',
      data: { file, modelUrl },
    });
  }

  cargarOpcionesMaterial(item: ArchivoItem) {
    this.api.getMaterials().subscribe((materials) => {
      item.materials = materials;

      if (materials.length > 0) {
        item.material = materials[0];

        const price = item.material.price;
        const volumen = item.volumen ?? 0;

        const estimado = volumen > 0 ? volumen * price : 1.0;

        item.precioEstimado = +estimado.toFixed(2);
      }
    });
  }

  recalcularPrecio(item: ArchivoItem): void {
    if (item.material?.price != null) {
      const volumen = item.volumen ?? 0;
      const price = item.material.price;
      const estimado = volumen > 0 ? volumen * price : 1.00;

      item.precioEstimado = +estimado.toFixed(2);
    }
  }


  protected readonly Math = Math;

  onProceedToPay() {
    const productos = this.archivos.map((archivo) => ({
      name: archivo.filename,
      image: archivo.thumbnail ?? '',
      price: +(archivo.precioEstimado ?? 0),
      quantity: archivo.cantidad ?? 1,
    }));

    this.checkout.onProceedToPay(productos);
  }

  get puedePagar(): boolean {
    return this.archivos.length > 0 && this.archivos.every((a) => a.loaded);
  }
}
